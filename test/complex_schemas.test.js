'use strict';

const convert = require('../');
const should = require('should');
const getSchema = require('./helpers').getSchema;

['basic', 'address', 'calendar'].forEach(test => {
	it(`converts ${test}/openapi.json`, () => {
		const schema = getSchema(test + '/json-schema.json');
		const result = convert(schema);
		const expected = getSchema(test + '/openapi.json');

		should(result).deepEqual(expected, 'converted');
	});

	it(`converting ${test}/openapi.json in place`, () => {
		const schema = getSchema(test + '/json-schema.json');
		const result = convert(schema, { cloneSchema: false });
		const expected = getSchema(test + '/openapi.json');

		should(schema).deepEqual(result, 'changed schema in place');
		should(result).deepEqual(expected, 'converted');
	});
});
