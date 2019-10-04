# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [0.4.0] - 2019-10-04
### Added
- Take the first JSON Schema `example` and put in OpenAPI Schema Object `example`

## [0.3.0] - 2018-12-18
### Added
- Create empty items, as it must always be present for type: array
- Rewrite exclusiveMinimum/exclusiveMaximum
- Rewrite if/then/else as oneOf + allOf
- Rewrite const as single element enum

## [0.2.0] - 2018-05-10
### Fixed
- Implemented [@cloudflare/json-schema-walker] to make sure all subschemas are
  processed

[@cloudflare/json-schema-walker]: https://github.com/cloudflare/json-schema-tools#cloudflarejson-schema-walker

## [0.1.1] - 2018-04-09
### Added
- Convert `dependencies` to an allOf + oneOf OpenAPI-valid equivalent
