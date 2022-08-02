import convert from '../src';

it('items', async ({ expect }) => {
	const schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'array',
		items: {
			type: 'string',
			format: 'date-time',
			example: '2017-01-01T12:34:56Z',
		},
	};

	const result = await convert(schema);

	const expected = {
		type: 'array',
		items: {
			type: 'string',
			format: 'date-time',
			example: '2017-01-01T12:34:56Z',
		},
	};

	expect(result).toEqual(expected);
});
