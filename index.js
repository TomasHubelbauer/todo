#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

const threshold = 60;
const selfRun = import.meta.url.endsWith(process.argv[1]);
const defaultRegex = '!(\.git$|node_modules)';

export default async function* todo(directoryPath = undefined, pathRegex = selfRun ? process.argv[2] : defaultRegex, log = false) {
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

async function* walk(/** @type {string} */ directoryPath = '.', pathRegex = defaultRegex, log = false) {
  log && console.log('walk', { directoryPath, pathRegex });

  // Determine whether the regex represents the opposite
  const bang = pathRegex[0] === '!';
  const regex = new RegExp(pathRegex.slice(bang ? 1 : 0));
  for (const entry of await fs.promises.readdir(directoryPath, { withFileTypes: true })) {
    const entryPath = path.join(directoryPath, entry.name);
    log && console.log(entryPath, bang ? 'not matches' : 'matches', regex, '=', bang ? !regex.test(entryPath) : regex.test(entryPath));
    if (bang ? regex.test(entryPath) : !regex.test(entryPath)) {
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

if (selfRun) {
  for await (const item of todo()) {
    const text = item.text.length > threshold ? item.text.slice(0, threshold) + '…' : item.text;
    console.log(`./${item.path}:${item.line}`, text);
  }
}
