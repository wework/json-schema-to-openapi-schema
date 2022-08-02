import convert from '../src';

it('iterates allOfs and converts types', async ({ expect }) => {
	const schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		allOf: [
			{
				type: 'object',
				required: ['foo'],
				properties: {
					foo: {
						type: 'integer',
						format: 'int64',
					},
				},
			},
			{
				allOf: [
					{
						type: 'number',
						format: 'double',
					},
				],
			},
		],
	};

	const result = await convert(schema);

	const expected = {
		allOf: [
			{
				type: 'object',
				required: ['foo'],
				properties: {
					foo: {
						type: 'integer',
						format: 'int64',
					},
				},
			},
			{
				allOf: [
					{
						type: 'number',
						format: 'double',
					},
				],
			},
		],
	};

	expect(result).toEqual(expected);
});

it('iterates anyOfs and converts types', async ({ expect }) => {
	const schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		anyOf: [
			{
				type: 'object',
				required: ['foo'],
				properties: {
					foo: {
						type: 'integer',
						format: 'int64',
					},
				},
			},
			{
				anyOf: [
					{
						type: 'object',
						properties: {
							bar: {
								type: 'number',
								format: 'double',
							},
						},
					},
				],
			},
		],
	};

	const result = await convert(schema);

	const expected = {
		anyOf: [
			{
				type: 'object',
				required: ['foo'],
				properties: {
					foo: {
						type: 'integer',
						format: 'int64',
					},
				},
			},
			{
				anyOf: [
					{
						type: 'object',
						properties: {
							bar: {
								type: 'number',
								format: 'double',
							},
						},
					},
				],
			},
		],
	};

	expect(result).toEqual(expected);
});

it('iterates oneOfs and converts types', async ({ expect }) => {
	const schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		oneOf: [
			{
				type: 'object',
				required: ['foo'],
				properties: {
					foo: {
						type: ['string', 'null'],
					},
				},
			},
			{
				oneOf: [
					{
						type: 'object',
						properties: {
							bar: {
								type: ['string', 'null'],
							},
						},
					},
				],
			},
		],
	};

	const result = await convert(schema);

	const expected = {
		oneOf: [
			{
				type: 'object',
				required: ['foo'],
				properties: {
					foo: {
						type: 'string',
						nullable: true,
					},
				},
			},
			{
				oneOf: [
					{
						type: 'object',
						properties: {
							bar: {
								type: 'string',
								nullable: true,
							},
						},
					},
				],
			},
		],
	};

	expect(result).toEqual(expected);
});

it('converts types in not', async ({ expect }) => {
	const schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object',
		properties: {
			not: {
				type: ['string', 'null'],
				minLength: 8,
			},
		},
	};

	const result = await convert(schema);

	const expected = {
		type: 'object',
		properties: {
			not: {
				type: 'string',
				nullable: true,
				minLength: 8,
			},
		},
	};

	expect(result).toEqual(expected);
});

it('nested combination keywords', async ({ expect }) => {
	const schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		anyOf: [
			{
				allOf: [
					{
						type: 'object',
						properties: {
							foo: {
								type: ['string', 'null'],
							},
						},
					},
					{
						type: 'object',
						properties: {
							bar: {
								type: ['integer', 'null'],
							},
						},
					},
				],
			},
			{
				type: 'object',
				properties: {
					foo: {
						type: 'string',
					},
				},
			},
			{
				not: {
					type: 'string',
					example: 'foobar',
				},
			},
		],
	};

	const result = await convert(schema);

	const expected = {
		anyOf: [
			{
				allOf: [
					{
						type: 'object',
						properties: {
							foo: {
								type: 'string',
								nullable: true,
							},
						},
					},
					{
						type: 'object',
						properties: {
							bar: {
								type: 'integer',
								nullable: true,
							},
						},
					},
				],
			},
			{
				type: 'object',
				properties: {
					foo: {
						type: 'string',
					},
				},
			},
			{
				not: {
					type: 'string',
					example: 'foobar',
				},
			},
		],
	};

	expect(result).toEqual(expected);
});
