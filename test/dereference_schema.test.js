'use strict';

const convert = require('../');
const should = require('should');
const nock = require('nock');
const { join } = require('path');

it('not dereferencing schema by default', async () => {
  const schema = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    properties: {
      foo: {
        $ref: '#/definitions/foo',
      },
    },
    definitions: {
      foo: ['string', 'null'],
    },
  };

  const result = await convert(JSON.parse(JSON.stringify(schema)));

  const expected = { ...schema };
  delete expected.$schema;

  should(result).deepEqual(expected, 'result does not match the expected');
});

it('dereferencing schema with deference option', async () => {
  const schema = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    type: {
      $ref: '#/definitions/foo',
    },
    definitions: {
      foo: ['string', 'null'],
    },
  };

  const result = await convert(schema, { dereference: true });

  const expected = {
    type: 'string',
    nullable: true,
    definitions: {
      foo: ['string', 'null'],
    },
  };

  should(result).deepEqual(expected, 'result does not match the expected');
});

it('dereferencing schema with remote http and https references', async () => {
  nock('http://foo.bar/')
    .get('/schema.yaml')
    .replyWithFile(200, join(__dirname, 'fixtures/definitions.yaml'), {
      'Content-Type': 'application/yaml',
    });

  nock('https://baz.foo/')
    .get('/schema.yaml')
    .replyWithFile(200, join(__dirname, 'fixtures/definitions.yaml'), {
      'Content-Type': 'application/yaml',
    });

  const schema = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    allOf: [
      { $ref: 'http://foo.bar/schema.yaml#/definitions/foo' },
      { $ref: 'https://baz.foo/schema.yaml#/definitions/bar' },
    ],
  };

  const result = await convert(schema, { dereference: true });

  const expected = {
    allOf: [
      { type: 'string' },
      { type: 'number' },
    ],
  };

  should(result).deepEqual(expected, 'result does not match the expected');
});

it('dereferencing schema with file references', async () => {
  const schema = {
    $schema: 'http://json-schema.org/draft-04/schema#',
    allOf: [
      // points to current working directory, hence the `test` prefix
      { $ref: './test/fixtures/definitions.yaml#/definitions/foo' },
      { $ref: join(__dirname, 'fixtures/definitions.yaml#/definitions/bar') },
    ],
  };

  const result = await convert(schema, { dereference: true });

  const expected = {
    allOf: [
      { type: 'string' },
      { type: 'number' },
    ],
  };

  should(result).deepEqual(expected, 'result does not match the expected');
});
