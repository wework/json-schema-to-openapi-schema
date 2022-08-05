# JSON Schema to OpenAPI Schema

A little NodeJS package to convert JSON Schema to a [OpenAPI Schema Object](http://spec.openapis.org/oas/v3.0.3.html#schema-object).

[![Treeware](https://img.shields.io/badge/dynamic/json?color=brightgreen&label=Treeware&query=%24.total&url=https%3A%2F%2Fpublic.offset.earth%2Fusers%2Ftreeware%2Ftrees)](https://treeware.earth)

## Features

- converts JSON Schema Draft 04 to OpenAPI 3.0 Schema Object
- switches `type: ['foo', 'null']` to `type: foo` and `nullable: true`
- supports deep structures with nested `allOf`s etc.
- switches `patternProperties` to `x-patternProperties`
- converts `dependencies` to an allOf + oneOf OpenAPI-valid equivalent

## Installation

```shell
npm install --save @openapi-contrib/json-schema-to-openapi-schema
```

Requires NodeJS v10 or greater.

## Usage

Here's a small example to get the idea:

```js
const convert = require('@openapi-contrib/json-schema-to-openapi-schema');

const schema = {
	$schema: 'http://json-schema.org/draft-04/schema#',
	type: ['string', 'null'],
	format: 'date-time',
};

(async () => {
	const convertedSchema = await convert(schema);
	console.log(convertedSchema);
})();
```

The example prints out

```js
{
  type: 'string',
  format: 'date-time',
  nullable: true
}
```

### Options

The function accepts `options` object as the second argument.

#### `cloneSchema` (boolean)

If set to `false`, converts the provided schema in place. If `true`, clones the schema by converting it to JSON and back. The overhead of the cloning is usually negligible. Defaults to `true`.

#### `dereference` (boolean)

If set to `true`, all local and remote references (http/https and file) $refs will be dereferenced. Defaults to `false`.

#### `convertUnreferencedDefinitions` (boolean)

Defaults to true.

If a schema had a definitions property (which is valid in JSONSchema), and only some of those entries are referenced, we'll still try and convert the remaining definitions to OpenAPI. If you do not want this behavior, set this to `false`.

#### `dereferenceOptions` (object = $RefParser.Options)

Options to pass to the dereferencer (@apidevtools/json-schema-ref-parser). To prevent circular references, pass `{ dereference: { circular: 'ignore' } }`.

## Command Line

```sh
Usage:
    json-schema-to-openapi-schema <command> [options] <file>

Commands:
    convert                 Converts JSON Schema Draft 04 to OpenAPI 3.0 Schema Object

Options:
    -h, --help              Show help for any command
    -v, --version           Output the CLI version number
    -d, --dereference       If set all local and remote references (http/https and file) $refs will be dereferenced
```

## Why?

OpenAPI is often described as an extension of JSON Schema, but both specs have changed over time and grown independently. OpenAPI v2 was based on JSON Schema draft v4 with a long list of deviations, but OpenAPI v3 shrank that list, upping their support to draft v4 and making the list of discrepancies shorter. This has been solved for OpenAPI v3.1, but for those using OpenAPI v3.0, you can use this tool to solve [the divergence](https://apisyouwonthate.com/blog/openapi-and-json-schema-divergence).

![Diagram showing data model (the objects, payload bodies, etc) and service model (endpoints, headers, metadata, etc)](https://cdn-images-1.medium.com/max/1600/0*hijIL-3Xa5EFZ783.png)

This tool sets out to allow folks to convert from JSON Schema (their one source of truth for everything) to OpenAPI (a thing for HTML docs and making SDKs).

## Versions

- **From:** [JSON Schema Draft v5 †](http://json-schema.org/specification-links.html#draft-5)
- **To:** [OpenAPI 3.0](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.3.md)

_† Draft v5 is also known as Draft Wright 00, as the drafts are often named after the author, and this was the first one by A. Wright. Amongst other things, draft v5 aimed to rewrite the meta files, but the experiment failed, meaning we need to continue to use the draft v4 metafiles. Ugh._

## Converting Back

To convert the other way, check out [openapi-schema-to-json-schema], which this package was based on.

## Tests

To run the test-suite:

```shell
npm test
```

## Treeware

This package is [Treeware](https://treeware.earth). If you use it in production, then we ask that you [**buy the world a tree**](https://plant.treeware.earth/{venfor}/{package}) to thank us for our work. By contributing to the Treeware forest you’ll be creating employment for local families and restoring wildlife habitats.

## Thanks

- [Stoplight][] for [donating time and effort](https://stoplight.io/blog/companies-supporting-open-source/) to this project, and many more.
- [mikunn][] for creating [openapi-schema-to-json-schema] which this is based on.
- [Phil Sturgeon][] for flipping that conversion script about face.
- [WeWork][] for giving this a home for a while.
- [All Contributors][link-contributors]

[mikunn]: https://github.com/mikunn
[wework]: https://github.com/wework
[stoplight]: https://stoplight.io/
[phil sturgeon]: https://github.com/philsturgeon
[openapi-schema-to-json-schema]: https://github.com/openapi-contrib/openapi-schema-to-json-schema
[link-contributors]: https://github.com/openapi-contrib/json-schema-to-openapi-schema/graphs/contributors
