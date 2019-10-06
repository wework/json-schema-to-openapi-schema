'use strict';

const convert = require('../');
const should = require('should');
const getSchema = require('./helpers').getSchema;

it('dateTime is invalid type', () => {
	const schema = { type: 'dateTime' };
	return should(convert(schema)).rejectedWith({ name: 'InvalidTypeError' });
});


it('foo is invalid type', () => {
	const schema = { type: 'foo' };
	return should(convert(schema)).rejectedWith({ name: 'InvalidTypeError' });
});

it('invalid type inside complex schema', () => {
	const schema = getSchema('invalid/json-schema.json');
	return should(convert(schema)).rejectedWith({ name: 'InvalidTypeError' });
});
