import convert from '../src';

it('if-then-else', async ({ expect }) => {
	const schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		if: { type: 'object' },
		then: { properties: { id: { type: 'string' } } },
		else: { format: 'uuid' },
	};

	const result = await convert(schema);

	const expected = {
		oneOf: [
			{
				allOf: [{ type: 'object' }, { properties: { id: { type: 'string' } } }],
			},
			{ allOf: [{ not: { type: 'object' } }, { format: 'uuid' }] },
		],
	};

	expect(result).toEqual(expected);
});

it('if-then', async ({ expect }) => {
	const schema = {
		$schema: 'http://json-schema.org/draft-07/schema#',
		type: 'object',
		properties: {
			type: {
				type: 'string',
				enum: ['css', 'js', 'i18n', 'json'],
			},
			locale: {
				type: 'string',
			},
		},
		if: {
			properties: {
				type: {
					const: 'i18n',
				},
			},
		},
		then: {
			required: ['locale'],
		},
	};
	const result = await convert(schema);

	const expected = {
		type: 'object',
		properties: {
			type: {
				type: 'string',
				enum: ['css', 'js', 'i18n', 'json'],
			},
			locale: {
				type: 'string',
			},
		},
		oneOf: [
			{
				allOf: [
					{
						properties: {
							type: {
								enum: ['i18n'],
							},
						},
					},
					{
						required: ['locale'],
					},
				],
			},
			{
				allOf: [
					{
						not: {
							properties: {
								type: {
									enum: ['i18n'],
								},
							},
						},
					},
				],
			},
		],
	};

	expect(result).toEqual(expected);
});
