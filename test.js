import todo from './index.js';

process.on('unhandledRejection', error => { throw error; });

void async function () {
  const actual = [];
  const expected = [
    './index.js:6 Allow configuring this through the CLI',
    './index.js:15 Skip binary files by text/blob detection or CLI ignore list or both',
    './index.js:48 Support comments with continuations as per the readme',
    './index.js:69 Extract out to a `node-cli-call` module for reuse',
    './readme.md:26  Recognize multi-line comments where the to-do is not on the first line',
    './readme.md:34  Recognize mutli-line single-line to-do comments',
    './readme.md:37 Do something',
    './readme.md:39 Do something else',
    './readme.md:45 Do a thing',
    './readme.md:49 Do a thing',
    './readme.md:54  Allow configuring ignored entry names through the CLI',
    './readme.md:60  Consider adding text/blob differentiation if CLI ignore option isn\'t enough',
    './readme.md:64  Allow ignoring specific lines',
    './readme.md:68  Warn on unused ignore rules (maybe opt-in)',
    './test\\test.css:1 Test',
    './test\\test.js:1 Test',
    './test\\test.js:2 Test',
    './test\\test.md:2 Test',
    './test\\test.md:5 Test',
    './test\\test.md:10  Test',
    './test\\test.ps1:1 Test',
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
