# JSON Schema to OpenAPI Schema

A little NodeJS package to convert JSON Schema to [OpenAPI Schema Objects](https://swagger.io/specification/#schemaObject).

## Features

* converts JSON Schema Draft 00 Wright (a.k.a draft v5) to OpenAPI 3.0 Schema Object
* switches `type: ['foo', 'null']` to `type: foo` and `nullable: true`
* supports deep structures with nested `allOf`s etc.
* switches `patternProperties` to `x-patternProperties`
* converts `dependencies` to an allOf + oneOf OpenAPI-valid equivalent

## Installation

```
npm install --save json-schema-to-openapi-schema
```

## Usage

Here's a small example to get the idea:

```js
const toOpenApi = require('json-schema-to-openapi-schema');

const schema = {
  '$schema': 'http://json-schema.org/draft-04/schema#',
  type: ['string', 'null'],
  format: 'date-time',
};

const convertedSchema = toOpenApi(schema);

console.log(convertedSchema);
```

The example prints out

```js
{
  type: 'string',
  format: 'date-time',
  nullable: true
}
```

**NOTE**: `$ref`s are not dereferenced. Use a dereferencer such as [json-schema-ref-parser](https://www.npmjs.com/package/json-schema-ref-parser) prior to using this package.

### Options

The function accepts `options` object as the second argument.

#### `cloneSchema` (boolean)

If set to `false`, converts the provided schema in place. If `true`, clones the schema by converting it to JSON and back. The overhead of the cloning is usually negligible. Defaults to `true`.


## Why?

OpenAPI is often described as an extension of JSON Schema, but both specs have changed over time and grown independently. OpenAPI v2 was based on JSON Schema draft v4 with a long list of deviations, but OpenAPI v3 shrank that list, upping their support to draft v4 and making the list of discrepancies shorter. Despite OpenAPI v3 closing the gap, the issue of JSON Schema divergence has not been resolved fully.

![Diagram showing data model (the objects, payload bodies, etc) and service model (endpoints, headers, metadata, etc)](https://cdn-images-1.medium.com/max/1600/0*hijIL-3Xa5EFZ783.png)

Carefully writing JSON Schema for your data model kiiiinda works, but it is possible to write JSON Schema that creates invalid OpenAPI, and vice versa. For more on this, read the article [_OpenAPI and JSON Schema Divergence_](https://blog.apisyouwonthate.com/openapi-and-json-schema-divergence-part-1-1daf6678d86e).

This tool sets out to allow folks to convert from JSON Schema (their one source of truth for everything) to OpenAPI (a thing for HTML docs and making SDKs).

## Versions

- **From:** [JSON Schema Draft v5 †](http://json-schema.org/specification-links.html#draft-5)
- **To:** [OpenAPI 3.0](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md)

_† Draft v5 is also known as Draft Wright 00, as the drafts are often named after the author, and this was the first one by A. Wright. Amongst other things, draft v5 aimed to rewrite the meta files, but the experiment failed, meaning we need to continue to use the draft v4 metafiles. Ugh._

## TODO

- [ ] Support later JSON Schema drafts via [cloudflare/json-schema-transformer] when it adds that functionality

## Converting Back

To convert the other way, check out [openapi-schema-to-json-schema], which this package was based on.

## Tests

To run the test-suite:

```shell
npm test
```

## Credits

- [mikunn] for creating [openapi-schema-to-json-schema] which this is based on
- [Phil Sturgeon] for flipping that conversion script about face
- [All Contributors][link-contributors]

[mikunn]: https://github.com/mikunn
[Phil Sturgeon]: https://github.com/philsturgeon
[openapi-schema-to-json-schema]: https://github.com/mikunn/openapi-schema-to-json-schema
[link-contributors]: https://github.com/wework/json-schema-to-openapi-schema/graphs/contributors
[cloudflare/json-schema-transformer]: https://github.com/cloudflare/json-schema-tools/blob/master/workspaces/json-schema-transform/README.md
