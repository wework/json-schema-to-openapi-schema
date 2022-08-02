import convert from '../src';

it('renames patternProperties to x-patternProperties', async ({ expect }) => {
	const schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object',
		additionalProperties: {
			type: 'string',
		},
		patternProperties: {
			'^[a-z]*$': {
				type: 'string',
			},
		},
	};

	const result = await convert(schema);

	const expected = {
		type: 'object',
		additionalProperties: {
			type: 'string',
		},
		'x-patternProperties': {
			'^[a-z]*$': {
				type: 'string',
			},
		},
	};

	expect(result).toEqual(expected);
});
