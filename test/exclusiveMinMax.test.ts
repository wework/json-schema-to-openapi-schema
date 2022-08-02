import convert from '../src';

it('exclusiveMinMax', async ({ expect }) => {
	const schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'integer',
		exclusiveMaximum: 10,
		exclusiveMinimum: 0,
	};

	const result = await convert(schema);

	const expected = {
		type: 'integer',
		maximum: 10,
		exclusiveMaximum: true,
		minimum: 0,
		exclusiveMinimum: true,
	};

	expect(result).toEqual(expected);
});
