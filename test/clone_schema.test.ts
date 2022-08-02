import convert from '../src';

it('cloning schema by default', async ({ expect }) => {
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
	expect(result).not.toEqual(schema);
});

it('cloning schema with cloneSchema option', async ({ expect }) => {
	const schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: ['string', 'null'],
	};

	const result = await convert(schema, { cloneSchema: true });

	const expected = {
		type: 'string',
		nullable: true,
	};

	expect(result).toEqual(expected);
	expect(result).not.toEqual(schema);
});

it('direct schema modification', async ({ expect }) => {
	const schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: ['string', 'null'],
	};

	const result = await convert(schema, { cloneSchema: false });

	const expected = {
		type: 'string',
		nullable: true,
	};

	expect(result).toEqual(expected);
	expect(result).toEqual(schema);
});
