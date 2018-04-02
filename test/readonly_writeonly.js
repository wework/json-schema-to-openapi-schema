var test = require('tape')
	, convert = require('../')
;

test('maintain readOnly and writeOnly props', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'object',
		properties: {
			prop1: {
				type: 'string',
				readOnly: true
			},
			prop2: {
				type: 'string',
				writeOnly: true
			}
		}
	};

	result = convert(schema);

	expected = {
		type: 'object',
		properties: {
			prop1: {
				type: 'string',
				readOnly: true
			},
			prop2: {
				type: 'string',
				writeOnly: true
			}
		}
	};

	assert.deepEqual(result, expected);
});

test('deep schema', function(assert) {
	var schema
		, result
		, expected
	;

	assert.plan(1);

	schema = {
		type: 'object',
		required: ['prop1', 'prop2'],
		properties: {
			prop1: {
				type: 'string',
				readOnly: true
			},
			prop2: {
				allOf: [
					{
						type: 'object',
						required: ['prop3'],
						properties: {
							prop3: {
								type: 'object',
								readOnly: true
							}
						}
					},
					{
						type: 'object',
						properties: {
							prop4: {
								type: 'object',
								readOnly: true
							}
						}
					},
				]
			}
		}
	};

	result = convert(schema);

	expected = {
		type: 'object',
		required: ['prop1', 'prop2'],
		properties: {
			prop1: {
				type: 'string',
				readOnly: true
			},
			prop2: {
				allOf: [
					{
						type: 'object',
						required: ['prop3'],
						properties: {
							prop3: {
								type: 'object',
								readOnly: true
							}
						}
					},
					{
						type: 'object',
						properties: {
							prop4: {
								type: 'object',
								readOnly: true
							}
						}
					},
				]
			}
		}
	};

	assert.deepEqual(result, expected);
});
