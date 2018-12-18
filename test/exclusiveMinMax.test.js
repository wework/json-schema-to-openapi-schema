'use strict';

const convert = require('../');
const should = require('should');

it('exclusiveMinMax', () => {
	const schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'integer',
                exclusiveMaximum: 10,
		exclusiveMinimum: 0
	};

	const result = convert(schema);

	const expected = {
		type: 'integer',
		maximum: 10,
		exclusiveMaximum: true,
		minimum: 0,
		exclusiveMinimum: true
	};

	should(result).deepEqual(expected, 'converted');
});
