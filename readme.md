# To-Do

[![](https://github.com/tomashubelbauer/todo/workflows/github-actions/badge.svg)](https://github.com/TomasHubelbauer/todo/actions)

A simple utility to print code to-do comments and unchecked MarkDown checkboxes.

## Installation

`npm i -g tomashubelbauer/todo` or `npx tomashubelbauer/todo`

## Usage

`todo`

**This will read all files in the directory, including binary files, read on!**

Sample output:

```
./test.md:10 MarkDown checkbox
./test.md:20 MarkDown sub-heading of "To-Do" heading
./test.js:10 JavaScript comment
./test.ps1:10 PowerShell comment
```

Pass a regex to match paths against as a CLI argument to include/exclude paths:

`todo "regex"`

- `^((?!(\.git|node_modules)).)*$`: ignore `.git` and `node_modules` (default)
- `.md$`: inspect only MarkDown files
- `.(md|js)$`: inspect only MarkDown and JavaScript files
- `^((?!(\.git|node_modules)).)*(?!\.(png|jpg|gif))$`: ignore default and images

## Development

`npm test` to run tests or `node .` to run the app.

### To-Do

#### Allow ignoring specific lines

This should enable weeding out any false positives we encounter.

#### Warn on unused ignore rules (maybe opt-in)

This should highlight ignore rules which are no longer needed.
