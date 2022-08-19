import convert from '../src';

it('supports default values of null', async ({ expect }) => {
	const schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: 'object',
		properties: {
			nullableStringWithDefault: {
				default: null,
				oneOf: [{ type: 'string' }, { type: 'null' }],
			}
		}
	};

	const result = await convert(schema);

	const expected = {
		type: 'object',
		properties: {
			nullableStringWithDefault: {
				default: null,
				oneOf: [{ type: 'string' }, { nullable: true }],
			}
		}
	};

	expect(result).toEqual(expected);
});
