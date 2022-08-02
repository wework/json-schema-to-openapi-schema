import convert from '../src';

it('const', async ({ expect }) => {
	const schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'string',
		const: 'hello',
	};

	const result = await convert(schema);

	const expected = {
		type: 'string',
		enum: ['hello'],
	};

	expect(result).toEqual(expected);
});

it('falsy const', async ({ expect }) => {
	const schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'boolean',
		const: false,
	};

	const result = await convert(schema);

	const expected = {
		type: 'boolean',
		enum: [false],
	};

	expect(result).toEqual(expected);
});
