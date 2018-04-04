'use strict';

const convert = require('../');
const should = require('should');
const getSchema = require('./helpers').getSchema;

it('complex schema', () => {
	const schema = getSchema('json-schema-expected.json');
	const result = convert(schema);
	const expected = getSchema('openapi-schema.json');

	should(result).deepEqual(expected, 'converted');
});

it('converting complex schema in place', () => {
	const schema = getSchema('json-schema-expected.json');
	const result = convert(schema, { cloneSchema: false });
	const expected = getSchema('openapi-schema.json');

	should(schema).deepEqual(result, 'changed schema in place');
	should(result).deepEqual(expected, 'converted');
});
