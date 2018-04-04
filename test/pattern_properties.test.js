'use strict';

const convert = require('../');
const should = require('should');

it('renames patternProperties to x-patternProperties', () => {
	const schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object',
		additionalProperties: {
			type: 'string'
		},
		patternProperties: {
			'^[a-z]*$': {
				type: 'string'
			}
		}
	};

	const result = convert(schema);

	const expected = {
		type: 'object',
		additionalProperties: {
			type: 'string'
		},
		'x-patternProperties': {
			'^[a-z]*$': {
				type: 'string'
			}
		}
	};

	should(result).deepEqual(expected);
});
