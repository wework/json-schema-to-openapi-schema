'use strict';

const convert = require('../');
const should = require('should');
const getSchema = require('./helpers').getSchema;

it('invalid types', () => {
	var schema, msg;

	schema = {
		type: 'dateTime'
	};

	msg = 'dateTime is invalid type';
	should.throws(() => { convert(schema); }, /InvalidTypeError/, msg);

	schema = {
		type: 'foo'
	};

	msg = 'foo is invalid type';
	should.throws(() => { convert(schema); }, /InvalidTypeError/, msg);

	schema = getSchema('schema-2-invalid-type.json');

	msg = 'invalid type inside complex schema';
	should.throws(() => { convert(schema); }, /InvalidTypeError.*invalidtype/, msg);
});
