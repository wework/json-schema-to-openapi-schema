var test = require('tape')
	, convert = require('../')
;

test('handles nullable', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(2);

	schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: ['string', 'null'],
	};

	result = convert(schema);

	expected = {
		type: 'string',
		nullable: true
	};

	assert.deepEqual(result, expected, 'nullable added');

	schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'string'
	};

	result = convert(schema);

	expected = {
		type: 'string'
	};

	assert.deepEqual(result, expected, 'nullable added');
});
