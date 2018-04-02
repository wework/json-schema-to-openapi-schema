// SWAPPED
var test = require('tape')
	, convert = require('../')
;

test('type array', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: ['string', 'null']
	};

	result = convert(schema);

	expected = {
		type: 'string',
		nullable: true
	};

	assert.deepEqual(result, expected, 'converted');
});

test('properties', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object',
		required: ['bar'],
		properties: {
			foo: {
				type: 'string',
			},
			bar: {
				type: ['string', 'null']
			}
		}
	};

	result = convert(schema);

	expected = {
		type: 'object',
		required: ['bar'],
		properties: {
			foo: {
				type: 'string',
			},
			bar: {
				type: 'string',
				nullable: true
			}
		}
	};

	assert.deepEqual(result, expected, 'converted');
});

test('addionalProperties is false', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object',
		properties: {
			foo: {
				type: 'string',
			}
		},
		additionalProperties: false
	};

	result = convert(schema);

	expected = {
		type: 'object',
		properties: {
			foo: {
				type: 'string',
			}
		},
		additionalProperties: false
	};

	assert.deepEqual(result, expected, 'properties converted');
});

test('addionalProperties is true', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object',
		properties: {
			foo: {
				type: 'string',
			}
		},
		additionalProperties: true
	};

	result = convert(schema);

	expected = {
		type: 'object',
		properties: {
			foo: {
				type: 'string',
			}
		},
		additionalProperties: true
	};

	assert.deepEqual(result, expected, 'properties converted');
});

test('addionalProperties is an object', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object',
		properties: {
			foo: {
				type: 'string',
			}
		},
		additionalProperties: {
			type: 'object',
			properties: {
				foo: {
					type: 'string',
					format: 'date-time'
				}
			}
		}
	};

	result = convert(schema);

	expected = {
		type: 'object',
		properties: {
			foo: {
				type: 'string'
			}
		},
		additionalProperties: {
			type: 'object',
			properties: {
				foo: {
					type: 'string',
					format: 'date-time'
				}
			}
		}
	};

	assert.deepEqual(result, expected, 'properties and additionalProperties converted');
});
