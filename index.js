#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const threshold = 60;

export default async function* todo(directoryPath = undefined, pathRegex = process.argv[2], log = false) {
  log && console.log('todo', { directoryPath, pathRegex });

  for await (const filePath of walk(directoryPath, pathRegex, log)) {
    let level;
    let multiline;

    const text = await fs.promises.readFile(filePath, 'utf-8');
    const lines = text.split(/\r?\n/g);
    for (let index = 0; index < lines.length; index++) {
      const line = lines[index];

      // Recognize comments which are detectable from a single line 
      const regex = /^\s*((\/\/ TODO:|# TODO:|- \[ \]|\d+\. \[ \]) (?<text1>.*?)|\/\* TODO: (?<text2>.*?) \*\/)$/;
      const match = regex.exec(line);
      if (match) {
        yield { path: filePath.replace(/\\/g, '/'), line: index + 1, text: match.groups.text1 || match.groups.text2 || '' };
        continue;
      }

      if (path.extname(filePath) === '.md') {
        if (level) {
          if (line.startsWith('#'.repeat(level + 1) + ' ')) {
            yield { path: filePath, line: index + 1, text: line.slice(level + 1 + ' '.length) };
          }
          else if (line.startsWith('#'.repeat(level) + ' ')) {
            level = undefined;
          }
        }
        else {
          // Recognize a To-Do header in a MarkDown document and remember its level
          const regex = /^(?<heading>#{2,4}) To-Do$/;
          const match = regex.exec(line);
          if (match) {
            level = match.groups.heading.length;
          }
        }
      }

      if (path.extname(filePath) === '.js') {
        const trim = line.trim();
        if (multiline) {
          if (trim === '*/') {
            multiline = false;
          }
          else if (trim.startsWith('* TODO: ')) {
            yield { path: filePath, line: index + 1, text: trim.slice('* TODO: '.length) };
          }
        }
        else {
          if (trim === '/*') {
            multiline = true;
          }
          else {
            const regex = /^throw new Error\(("TODO: (?<text1>.*?)"|'TODO: (?<text2>.*?)')\);?$/;
            const match = regex.exec(trim);
            if (match) {
              yield { path: filePath, line: index + 1, text: match.groups.text1 || match.groups.text2 || '' };
            }
          }
        }
      }
    }
  }
}

async function* walk(/** @type {string} */ directoryPath = '.', pathRegex = '^((?!(\.git|node_modules)).)*$', log = false) {
  log && console.log('walk', { directoryPath, pathRegex });

  const regex = new RegExp(pathRegex);
  for (const entry of await fs.promises.readdir(directoryPath, { withFileTypes: true })) {
    const entryPath = path.join(directoryPath, entry.name);
    if (!entryPath.match(regex)) {
      log && console.log(entryPath, 'skipped');
      continue;
    }

    if (entry.isFile()) {
      log && console.log(entryPath, 'returned');
      yield entryPath;
    }
    else if (entry.isDirectory()) {
      log && console.log(entryPath, 'nested');
      yield* walk(entryPath, pathRegex, log);
    }
  }
}

// TODO: Extract out to a `node-cli-call` module for reuse - related: https://stackoverflow.com/a/60309682/2715716
// TODO: Find out if this can be replaced with `import.meta.url.endsWith(process.argv[1])`
const url = import.meta.url;

// Resolve symlink `/usr/local/bin/todo` to `/usr/local/lib/node_modules/todo/index.js` on Linux
// Trim off leading `/` on Linux (`file:///usr/…` - `/` is cut from URL but present in `argv[1]`)
const argv1 = path.normalize(await fs.promises.realpath(process.argv[1])).replace(/^\//, '');
const normalizedFileName = path.normalize(url.slice('file:///'.length));
const normalizedDirectoryName = path.dirname(normalizedFileName);

if (normalizedDirectoryName === argv1 || normalizedFileName === argv1 || '/' + normalizedFileName === argv1 /* Linux `/usr/local/lib/node_modules/todo/index.js` */) {
  for await (const item of todo()) {
    const text = item.text.length > threshold ? item.text.slice(0, threshold) + '…' : item.text;
    console.log(`./${item.path}:${item.line}`, text);
  }
}
