// SWAPPED
const fs = require('fs');
const join = require('path').join;
const test = require('tape');
const convert = require('../');

test('complex schema', function(assert) {
	assert.plan(1);

	const schema = getSchema('json-schema-expected.json');
	const result = convert(schema);
	const expected = getSchema('openapi-schema.json');

	assert.deepEqual(result, expected, 'converted');
});

test('converting complex schema in place', function(assert) {
	assert.plan(2);

	const schema = getSchema('json-schema-expected.json');
	const result = convert(schema, { cloneSchema: false });
	const expected = getSchema('openapi-schema.json');

	assert.deepEqual(schema, result, 'changed schema in place');
	assert.deepEqual(result, expected, 'converted');
});

function getSchema(file) {
	const path = join(__dirname, 'schemas', file);
	return JSON.parse(fs.readFileSync(path));
}
