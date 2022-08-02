import convert from '../src';
import { getSchema } from './helpers';

it('dateTime is invalid type', async ({ expect }) => {
	const schema = { type: 'dateTime' };
	await expect(() => convert(schema)).rejects.toThrowError(
		/is not a valid type/
	);
});

it('foo is invalid type', async ({ expect }) => {
	const schema = { type: 'foo' };
	await expect(() => convert(schema)).rejects.toThrowError(
		/is not a valid type/
	);
});

it('invalid type inside complex schema', async ({ expect }) => {
	const schema = getSchema('invalid/json-schema.json');
	await expect(() => convert(schema)).rejects.toThrowError(
		/is not a valid type/
	);
});
