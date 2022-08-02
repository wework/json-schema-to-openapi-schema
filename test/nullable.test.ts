import convert from '../src';

it('adds `nullable: true` for `type: [string, null]`', async ({ expect }) => {
	const schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: ['string', 'null'],
	};

	const result = await convert(schema);

	expect(result).toEqual({
		type: 'string',
		nullable: true,
	});
});

it('supports nullables inside sub-schemas', async ({ expect }) => {
	const schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		oneOf: [{ type: 'string' }, { type: 'null' }],
	};

	const result = await convert(schema);

	expect(result).toEqual({
		oneOf: [{ type: 'string' }, { nullable: true }],
	});
});

it('does not add nullable for non null types', async ({ expect }) => {
	const schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'string',
	};

	const result = await convert(schema);

	expect(result).toEqual({
		type: 'string',
	});
});
