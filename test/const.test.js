'use strict';

const convert = require('../');
const should = require('should');

it('const', () => {
	const schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'string',
		const: 'hello'
	};

	const result = convert(schema);

	const expected = {
		type: 'string',
		enum: [ 'hello' ]
	};

	should(result).deepEqual(expected, 'converted');
});
