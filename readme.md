# To-Do

[![](https://github.com/tomashubelbauer/todo/workflows/github-actions/badge.svg)](https://github.com/TomasHubelbauer/todo/actions)

A simple utility to print code to-do comments starting with `// TODO:`.

## Installation

`npm i -g tomashubelbauer/todo` or `npx tomashubelbauer/todo`

## Usage

`todo`

Sample output:

```
./test.md:10 MarkDown checkbox
./test.md:20 MarkDown sub-heading of "To-Do" heading
./test.js:10 JavaScript comment
./test.ps1:10 PowerShell comment
```

## Development

`npm test` to run tests or `node .` to run the app.

### Known Limitations

- Ignored directories are hard-coded to `.git` and `node_modules`
- Binary files are being read and search for code todos as well

### To-Do

#### Recognize multi-line comments where the to-do is not on the first line

```js
/*
 * TODO: Recognize stuff like this to some degree of usefulness
 */
```

#### Recognize mutli-line single-line to-do comments

```js
// TODO: Do something
// This is a continuation of the above because another TODO follows immediately
// TODO: Do something else
// This is also a continuation because the comments end after and these is no
// space between the TODO line and this line
```

```js
// TODO: Do a thing
// 
// This is not a continuation because there is a space

// TODO: Do a thing
// This is not a continuation either because the comment is not followed by
// another to-do immediately so there is a risk of false-positive and we bail
```

#### Allow configuring ignored entry names through the CLI

This will enable configuring othen directories than `.git` and `node_modules`
and will also enable ignoring binary and large files without having to rely on
text/blob differentiation which is imperfect.

#### Consider adding text/blob differentiation if CLI ignore option isn't enough

I'd rather avoid it but it's not a complete non-option.

#### Allow ignoring specific lines

This should enable weeding out any false positives we encounter.

#### Warn on unused ignore rules (maybe opt-in)

This should highlight ignore rules which are no longer needed.
