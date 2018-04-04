'use strict';

const convert = require('../');
const should = require('should');

it('items', () => {
	const schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'array',
		items: {
			type: 'string',
			format: 'date-time',
			example: '2017-01-01T12:34:56Z'
		}
	};

	const result = convert(schema);

	const expected = {
		type: 'array',
		items: {
			type: 'string',
			format: 'date-time',
			example: '2017-01-01T12:34:56Z'
		}
	};

	should(result).deepEqual(expected, 'converted');
});
