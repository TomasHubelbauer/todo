import todo from './index.js';

process.on('unhandledRejection', error => { throw error; });

void async function () {
  const actual = [];
  const expected = [
    './index.js:89 Extract out to a `node-cli-call` module for reuse - related: https://stackoverflow.com/a/60309682/2715716',
    './readme.md:62 Allow ignoring specific lines',
    './readme.md:66 Warn on unused ignore rules (maybe opt-in)',
    './test/test.css:1 Test',
    './test/test.js:1 Test',
    './test/test.js:2 Test',
    './test/test.js:4 Test',
    './test/test.js:7 Test',
    './test/test.md:2 Test',
    './test/test.md:5 Test',
    './test/test.md:10 Test',
    './test/test.md:12 Test',
    './test/test.ps1:1 Test',
  ];
  
  for await (const item of todo()) {
    const actualItem = './' + item.path + ':' + item.line + ' ' + item.text;
    const expectedItem = expected[actual.length];
    if (actualItem !== expectedItem) {
      if (expectedItem === undefined) {
        throw new Error(`Got an unexpected extra to-do "${actualItem}".`);
      }

      throw new Error(`#${actual.length}: Expected "${expectedItem}", got "${actualItem}".`);
    }

    actual.push(actualItem);
  }

  if (actual.length !== expected.length) {
    throw new Error(`Expected ${expected.length} todos, got ${actual.length}.`);
  }
}()
