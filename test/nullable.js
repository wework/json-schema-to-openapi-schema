'use strict';

const convert = require('../');
const should = require('should');

it('adds `nullable: true` for `type: [string, null]`', () => {
	const schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: ['string', 'null'],
	};

	const result = convert(schema);

	should(result).deepEqual({
		type: 'string',
		nullable: true
	});
});

it('does not add nullable for non null types', () => {
	const schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'string'
	};

	const result = convert(schema);

	should(result).deepEqual({
		type: 'string'
	});
});
