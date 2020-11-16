#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// TODO: Allow configuring this through the CLI
const ignoredDirectoryNames = ['.git', 'node_modules'];

export default async function* todo() {
  for await (const filePath of walk()) {
    // TODO: Skip binary files by text/blob detection or CLI ignore list or both
    const text = await fs.promises.readFile(filePath, 'utf-8');
    const lines = text.split('\n').map(line => line.trim());
    for (const line of lines) {

      if (!line.startsWith('// TODO: ')) {
        continue;
      }

      yield line.slice('// TODO: '.length);
    }
  }
}

async function* walk(/** @type {string} */ directoryPath = '.') {
  for (const entry of await fs.promises.readdir(directoryPath, { withFileTypes: true })) {
    const entryPath = path.join(directoryPath, entry.name);
    if (entry.isFile()) {
      yield entryPath;
    }
    else if (entry.isDirectory()) {
      if (ignoredDirectoryNames.includes(entry.name)) {
        continue;
      }

      yield* walk(entryPath);
    }
  }
}

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
      console.log(item);
    }
  }
}()
