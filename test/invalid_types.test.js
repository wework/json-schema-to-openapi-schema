'use strict';

const convert = require('../');
const should = require('should');
const getSchema = require('./helpers').getSchema;

it('dateTime is invalid type', () => {
	const schema = { type: 'dateTime' };
	should.throws(() => { convert(schema); }, /InvalidTypeError/);
});


it('foo is invalid type', () => {
	const schema = { type: 'foo' };
	should.throws(() => { convert(schema); }, /InvalidTypeError/);
});

it('invalid type inside complex schema', () => {
	const schema = getSchema('invalid/json-schema.json');
	should.throws(() => { convert(schema); }, /InvalidTypeError.*invalidtype/);
});
