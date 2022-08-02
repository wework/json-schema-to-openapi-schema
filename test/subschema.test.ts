import convert from '../src';

it('strips $id from all subschemas not just root`', async ({ expect }) => {
	const schema = {
		$id: 'https://foo/bla',
		id: 'https://foo/bla',
		$schema: 'http://json-schema.org/draft-06/schema#',
		type: 'object',
		properties: {
			foo: {
				$id: '/properties/foo',
				type: 'array',
				items: {
					$id: '/properties/foo/items',
					type: 'object',
					properties: {
						id: {
							$id: '/properties/foo/items/properties/id',
							type: 'string',
						},
					},
				},
			},
		},
	};

	const result = await convert(schema);

	const expected = {
		type: 'object',
		properties: {
			foo: {
				type: 'array',
				items: {
					type: 'object',
					properties: {
						id: {
							type: 'string',
						},
					},
				},
			},
		},
	};
	expect(result).toEqual(expected);
});
