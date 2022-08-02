import convert from '../src';
import { getSchema } from './helpers';

['basic', 'address', 'calendar', 'events'].forEach((test) => {
	it(`converts ${test}/openapi.json`, async ({ expect }) => {
		const schema = getSchema(test + '/json-schema.json');
		const result = await convert(schema);

		const expected = getSchema(test + '/openapi.json');

		expect(result).toEqual(expected);
	});

	it(`converting ${test}/openapi.json in place`, async ({ expect }) => {
		const schema = getSchema(test + '/json-schema.json');
		const result = await convert(schema, { cloneSchema: false });
		const expected = getSchema(test + '/openapi.json');

		expect(schema).toEqual(result);
		expect(result).toEqual(expected);
	});
});
