const test = require('tape');
const convert = require('../');

test('iterates allOfs and converts types', function(assert) {
	assert.plan(1);

	const schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		allOf: [
			{
				type: 'object',
				required: ['foo'],
				properties: {
					foo: {
						type: 'integer',
						format: 'int64'
					}
				}
			},
			{
				allOf: [
					{
						type: 'number',
						format: 'double'
					}
				]
			}
		]
	};

	const result = convert(schema);

	const expected = {
		allOf: [
			{
				type: 'object',
				required: ['foo'],
				properties: {
					foo: {
						type: 'integer',
						format: 'int64'
					}
				}
			},
			{
				allOf: [
					{
						type: 'number',
						format: 'double'
					}
				]
			}
		]
	};

	assert.deepEqual(result, expected, 'iterated allOfs');
});

test('iterates anyOfs and converts types', function(assert) {
	assert.plan(1);

	const schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		anyOf: [
			{
				type: 'object',
				required: ['foo'],
				properties: {
					foo: {
						type: 'integer',
						format: 'int64'
					}
				}
			},
			{
				anyOf: [
					{
						type: 'object',
						properties: {
							bar: {
								type: 'number',
								format: 'double'
							}
						}
					}
				]
			}
		]
	};

	const result = convert(schema);

	const expected = {
		anyOf: [
			{
				type: 'object',
				required: ['foo'],
				properties: {
					foo: {
						type: 'integer',
						format: 'int64'
					}
				}
			},
			{
				anyOf: [
					{
						type: 'object',
						properties: {
							bar: {
								type: 'number',
								format: 'double'
							}
						}
					}
				]
			}
		]
	};

	assert.deepEqual(result, expected, 'anyOfs iterated');
});

test('iterates oneOfs and converts types', function(assert) {
	assert.plan(1);

	const schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		oneOf: [
			{
				type: 'object',
				required: ['foo'],
				properties: {
					foo: {
						type: ['string', 'null']
					}
				}
			},
			{
				oneOf: [
					{
						type: 'object',
						properties: {
							bar: {
								type: ['string', 'null']
							}
						}
					}
				]
			}
		]
	};

	const result = convert(schema);

	const expected = {
		oneOf: [
			{
				type: 'object',
				required: ['foo'],
				properties: {
					foo: {
						type: 'string',
						nullable: true
					}
				}
			},
			{
				oneOf: [
					{
						type: 'object',
						properties: {
							bar: {
								type: 'string',
								nullable: true
							}
						}
					}
				]
			}
		]
	};

	assert.deepEqual(result, expected, 'oneOfs iterated');
});

test('converts types in not', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object',
		properties: {
			not: {
				type: ['string', 'null'],
				minLength: 8
			}
		}
	};

	result = convert(schema);

	expected = {
		type: 'object',
		properties: {
			not: {
				type: 'string',
				nullable: true,
				minLength: 8
			}
		}
	};

	assert.deepEqual(result, expected, 'not handled');
});


test('nested combination keywords', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		anyOf: [
			{
				allOf: [
					{
						type: 'object',
						properties: {
							foo: {
								type: ['string', 'null']
							}
						}
					},
					{
						type: 'object',
						properties: {
							bar: {
								type: ['integer', 'null']
							}
						}
					}
				]
			},
			{
				type: 'object',
				properties: {
					foo: {
						type: 'string',
					}
				}
			},
			{
				not: {
					type: 'string',
					example: 'foobar'
				}
			}
		]
	};

	result = convert(schema);

	expected = {
		anyOf: [
			{
				allOf: [
					{
						type: 'object',
						properties: {
							foo: {
								type: 'string',
								nullable: true
							}
						}
					},
					{
						type: 'object',
						properties: {
							bar: {
								type: 'integer',
								nullable: true
							}
						}
					}
				]
			},
			{
				type: 'object',
				properties: {
					foo: {
						type: 'string',
					}
				}
			},
			{
				not: {
					type: 'string',
					example: 'foobar'
				}
			}
		]
	};

	assert.deepEqual(result, expected, 'nested combination keywords');
});
