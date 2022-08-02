import convert from '../src';

it('type array', async ({ expect }) => {
	const schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: ['string', 'null'],
	};

	const result = await convert(schema);

	const expected = {
		type: 'string',
		nullable: true,
	};

	expect(result).toEqual(expected);
});

it('properties', async ({ expect }) => {
	const schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object',
		required: ['bar'],
		properties: {
			foo: {
				type: 'string',
			},
			bar: {
				type: ['string', 'null'],
			},
		},
	};

	const result = await convert(schema);

	const expected = {
		type: 'object',
		required: ['bar'],
		properties: {
			foo: {
				type: 'string',
			},
			bar: {
				type: 'string',
				nullable: true,
			},
		},
	};

	expect(result).toEqual(expected);
});

it('addionalProperties is false', async ({ expect }) => {
	const schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object',
		properties: {
			foo: {
				type: 'string',
			},
		},
		additionalProperties: false,
	};

	const result = await convert(schema);

	const expected = {
		type: 'object',
		properties: {
			foo: {
				type: 'string',
			},
		},
		additionalProperties: false,
	};

	expect(result).toEqual(expected);
});

it('addionalProperties is true', async ({ expect }) => {
	const schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object',
		properties: {
			foo: {
				type: 'string',
			},
		},
		additionalProperties: true,
	};

	const result = await convert(schema);

	const expected = {
		type: 'object',
		properties: {
			foo: {
				type: 'string',
			},
		},
		additionalProperties: true,
	};

	expect(result).toEqual(expected);
});

it('addionalProperties is an object', async ({ expect }) => {
	const schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object',
		properties: {
			foo: {
				type: 'string',
			},
		},
		additionalProperties: {
			type: 'object',
			properties: {
				foo: {
					type: 'string',
					format: 'date-time',
				},
			},
		},
	};

	const result = await convert(schema);

	const expected = {
		type: 'object',
		properties: {
			foo: {
				type: 'string',
			},
		},
		additionalProperties: {
			type: 'object',
			properties: {
				foo: {
					type: 'string',
					format: 'date-time',
				},
			},
		},
	};

	expect(result).toEqual(expected);
});
