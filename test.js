import todo from './index.js';

const actual = [];
const expected = [
  './readme.md:62 Allow ignoring specific lines',
  './readme.md:66 Warn on unused ignore rules (maybe opt-in)',
  './readme.md:70 Reserve the MarkDown checkbox detection only for MarkDown files',
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
  './test/test.yml:1 Test',
];

const errors = [];

for await (const item of todo(undefined, undefined, true)) {
  const actualItem = './' + item.path + ':' + item.line + ' ' + item.text;
  const expectedItem = expected[actual.length];
  if (actualItem !== expectedItem) {
    if (expectedItem === undefined) {
      errors.push(`Got an unexpected extra to-do "${actualItem}".`);
    }

    errors.push(`#${actual.length}: Expected "${expectedItem}", got "${actualItem}".`);
  }

  actual.push(actualItem);
}

if (actual.length !== expected.length) {
  throw new Error(`Expected ${expected.length} todos, got ${actual.length}.`);
}
else if (errors.length === 0) {
  console.log('All', actual.length, 'passed');
}
else {
  console.log(errors);
  throw new Error(`Got ${errors.length} errors.`);
}
