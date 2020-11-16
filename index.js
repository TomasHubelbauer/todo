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
  if (path.normalize(path.dirname(import.meta.url.slice('file:///'.length))) === process.argv[1]) {
    for await (const item of todo()) {
      console.log(item);
    }
  }
  else {
    // TODO: Remove after the above is verified to work with `npx` and `npm i -g`
    console.log(import.meta.url, process.argv);
  }
}()
