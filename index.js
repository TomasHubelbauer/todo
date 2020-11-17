#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// TODO: Allow configuring this through the CLI
const ignoredNames = ['.git', 'node_modules'];

const threshold = 60;

export default async function* todo() {
  for await (const filePath of walk()) {
    let level;

    // TODO: Skip binary files by text/blob detection or CLI ignore list or both
    const text = await fs.promises.readFile(filePath, 'utf-8');
    const lines = text.split(/\r?\n/g);
    for (let index = 0; index < lines.length; index++) {
      const line = lines[index];

      // Recognize comments which are detectable from a single line
      // TODO: Add support for `throw new Error('TODO: ')` here
      const regex = /^\s*((\/\/ TODO:|# TODO:|- \[ \]) (?<text1>.*?)|\/\* TODO: (?<text2>.*?) \*\/)$/;
      const match = regex.exec(line);
      if (match) {
        yield { path: filePath, line: index + 1, text: match.groups.text1 || match.groups.text2 };
        continue;
      }

      if (path.extname(filePath) === '.md') {
        if (level) {
          if (line.startsWith('#'.repeat(level + 1) + ' ')) {
            yield { path: filePath, line: index + 1, text: line.slice(level + 1) };
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

      // TODO: Support comments with continuations as per the readme
    }
  }
}

async function* walk(/** @type {string} */ directoryPath = '.') {
  for (const entry of await fs.promises.readdir(directoryPath, { withFileTypes: true })) {
    if (ignoredNames.includes(entry.name)) {
      continue;
    }

    const entryPath = path.join(directoryPath, entry.name);
    if (entry.isFile()) {
      yield entryPath;
    }
    else if (entry.isDirectory()) {
      yield* walk(entryPath);
    }
  }
}

// TODO: Extract out to a `node-cli-call` module for reuse
void async function () {
  const url = import.meta.url;
  const argv1 = process.argv[1];

  // Uncomment these values to test whether calling as an executable works
  // const url = 'file:///C:/Users/TomasHubelbauer/AppData/Roaming/npm-cache/_npx/14128/node_modules/todo/index.js';
  // const argv1 = 'C:\\Users\\TomasHubelbauer\\AppData\\Roaming\\npm-cache\\_npx\\14128\\node_modules\\todo\\index.js';

  const normalizedFileName = path.normalize(url.slice('file:///'.length));
  const normalizedDirectoryName = path.dirname(normalizedFileName);

  if (normalizedDirectoryName === argv1 || normalizedFileName === argv1) {
    for await (const item of todo()) {
      const text = item.text.length > threshold ? item.text.slice(0, threshold) + '…' : item.text;
      console.log(`./${item.path}:${item.line}`, text);
    }
  }
}()
