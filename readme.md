# To-Do

[svg]: https://github.com/tomashubelbauer/todo/workflows/github-actions/badge.svg
[![][svg]](https://github.com/TomasHubelbauer/todo/actions)

A simple utility to print code to-do comments and unchecked MarkDown checkboxes.

## Installation

`npm i -g tomashubelbauer/todo` or `npx tomashubelbauer/todo`

## Usage

### CLI

`todo`

**This will read all files in the directory, including binary files, read on!**

Sample output:

```
./test.md:10 MarkDown checkbox
./test.md:20 MarkDown sub-heading of "To-Do" heading
./test.js:10 JavaScript comment
./test.ps1:10 PowerShell comment
```

Pass a regex to match paths against as a CLI argument. Prefix with a bang (`!`)
to reverse the logic.

`todo "regex"` or `todo "!regex"`

- `!(\.git$|node_modules)`: ignore `.git` and `node_modules` (default)
- `.md$`: inspect only MarkDown files
- `.(md|js)$`: inspect only MarkDown and JavaScript files
- `!(\.git$|node_modules|png$|jpg$|gif$)`: ignore default and images

Escape the bang if you want to use a regex starting with one. This trade-off has
been made to not force using negative lookahead syntax which is too confusing.

### Node

```
git submodule add https://github.com/tomashubelbauer/todo
```

```js
import todo from './todo/index.js';

for await (const item of todo()) {
  console.log(item);
}
```

## Development

`npm test` to run tests or `node .` to run the app.

### To-Do

#### Allow ignoring specific lines

This should enable weeding out any false positives we encounter.

#### Warn on unused ignore rules (maybe opt-in)

This should highlight ignore rules which are no longer needed.

#### Reserve the MarkDown checkbox detection only for MarkDown files

At current, it also captures MarkDown fragments in JavaScript which I'm not 100%
sure is what I want.
