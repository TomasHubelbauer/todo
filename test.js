import todo from './index.js';

void async function () {
  const actual = [];
  const expected = [
    'Allow configuring this through the CLI',
    'Skip binary files by text/blob detection or CLI ignore list or both',
    'Do something',
    'Do something else',
    'Do a thing',
    'Do a thing',
  ];

  for await (const actualItem of todo()) {
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
