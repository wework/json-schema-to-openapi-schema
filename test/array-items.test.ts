import convert from '../src';

it('array-items', async ({ expect }) => {
	const schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'array',
	};

	const result = await convert(schema);

	const expected = {
		type: 'array',
		items: {},
	};

	expect(result).toEqual(expected);
});
