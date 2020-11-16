# To-Do

A simple utility to print code to-do comments starting with `// TODO:`.

## Installation

`npm i -g tomashubelbauer/todo` or `npx tomashubelbauer/todo`

## Usage

`todo`

## Development

`npm test` or `npm .` to test application invocation.

### Known Limitations

- Ignored directories are hard-coded to `.git` and `node_modules`
- Binary files are being read and search for code todos as well

### To-Do

#### Recognize multi-line comments

```js
/*
 * TODO: Recognize stuff like this to some degree of usefulness
 */
```

#### Recognize CSS code comments

This should be covered by the JS multi-line comments, but tracking just in case.
Add a test for this, too.

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

#### Read `readme.me` for *To-Do* section and list sub-headings

To return results from a MarkDown document like this one.

#### List unchecked MarkDown checkboxen as to-do items

Will have to be careful about stuff like fenced code blocks with false positives
but generally that's an edge case.

#### Allow ignoring specific lines

This should enable weeding out any false positives we encounted.

#### Warn on unused ignore rules (maybe opt-in)

This should highlight ignore rules which are no longer needed.

#### Display file paths and line numbers for each to-do

Update the return value to be an asynchronous iterator of an object like this:

- `text` (`string`)
- `path` (`string`)
- `name` (`string`)
- `line` (`string`)
