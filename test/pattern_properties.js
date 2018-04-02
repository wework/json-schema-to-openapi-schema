var test = require('tape')
	, convert = require('../')
;

test('renames patternProperties to x-patternProperties', function(assert) {
	assert.plan(1);

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

	assert.deepEqual(result, expected);
});
