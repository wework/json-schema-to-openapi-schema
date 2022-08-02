import convert from '../src';

it('renames illegal (unknown) keywords as extensions and skips those that already are', async ({
	expect,
}) => {
	const schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object',
		properties: {
			subject: {
				type: 'string',
				customProperty: true,
				'x-alreadyAnExtension': true,
			},
		},
	};

	const result = await convert(schema);

	const expected = {
		type: 'object',
		properties: {
			subject: {
				type: 'string',
				'x-customProperty': true,
				'x-alreadyAnExtension': true,
			},
		},
	};

	expect(result).toEqual(expected);
});
