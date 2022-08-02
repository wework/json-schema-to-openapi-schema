import convert from '../src';

it('uses the first example from a schema', async ({ expect }) => {
	const schema = {
		$schema: 'http://json-schema.org/draft-06/schema#',
		examples: ['foo', 'bar'],
	};

	const result = await convert(schema);

	expect(result).toEqual({
		example: 'foo',
	});
});
