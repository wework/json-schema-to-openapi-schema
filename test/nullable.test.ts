import convert from '../src';
import { describe } from 'vitest';
import type { JSONSchema4 } from 'json-schema';

describe('nullable', () => {
	it('adds `nullable: true` for `type: [string, null]`', async ({ expect }) => {
		const schema = {
			$schema: 'http://json-schema.org/draft-04/schema#',
			type: ['string', 'null'],
		} satisfies JSONSchema4;

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
		} satisfies JSONSchema4;

		const result = await convert(schema);

		expect(result).toEqual({
			oneOf: [{ type: 'string', nullable: true }],
		});
	});
	it('supports nullables inside definitions', async ({ expect }) => {
		const schema = {
			$schema: 'http://json-schema.org/draft-07/schema#',
			definitions: {
				Product: {
					type: 'object',
					properties: {
						name: {
							type: 'string',
						},
						price: {
							type: 'number',
						},
						rating: {
							type: ['null', 'number'],
						},
					},
					required: ['name', 'price', 'rating'],
				},
				ProductList: {
					type: 'object',
					properties: {
						name: {
							type: 'string',
						},
						version: {
							type: 'string',
						},
						products: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									name: {
										type: 'string',
									},
									price: {
										type: 'number',
									},
									rating: {
										type: ['null', 'number'],
									},
								},
								required: ['name', 'price', 'rating'],
							},
						},
					},
					required: ['name', 'products', 'version'],
				},
			},
		};

		const result = await convert(schema);

		expect(result).toEqual({
			definitions: {
				Product: {
					type: 'object',
					properties: {
						name: {
							type: 'string',
						},
						price: {
							type: 'number',
						},
						rating: {
							type: 'number',
							nullable: true,
						},
					},
					required: ['name', 'price', 'rating'],
				},
				ProductList: {
					type: 'object',
					properties: {
						name: {
							type: 'string',
						},
						version: {
							type: 'string',
						},
						products: {
							type: 'array',
							items: {
								type: 'object',
								properties: {
									name: {
										type: 'string',
									},
									price: {
										type: 'number',
									},
									rating: {
										type: 'number',
										nullable: true,
									},
								},
								required: ['name', 'price', 'rating'],
							},
						},
					},
					required: ['name', 'products', 'version'],
				},
			},
		});
	});

	it('does not add nullable for non null types', async ({ expect }) => {
		const schema = {
			$schema: 'http://json-schema.org/draft-04/schema#',
			type: 'string',
		} satisfies JSONSchema4;

		const result = await convert(schema);

		expect(result).toEqual({
			type: 'string',
		});
	});

	it('adds nullable for types with null', async ({ expect }) => {
		const schema = {
			$schema: 'http://json-schema.org/draft-04/schema#',
			title: 'NullExample',
			description: 'Null Example',
			oneOf: [
				{
					type: 'object',
					properties: {
						foo: {
							type: 'string',
						},
					},
				},
				{
					type: 'object',
					properties: {
						bar: {
							type: 'number',
						},
					},
				},
				{
					type: 'null',
				},
			],
		} satisfies JSONSchema4;

		const result = await convert(schema);

		expect(result).toEqual({
			title: 'NullExample',
			description: 'Null Example',
			oneOf: [
				{
					type: 'object',
					properties: {
						foo: {
							type: 'string',
						},
					},
					nullable: true,
				},
				{
					type: 'object',
					properties: {
						bar: {
							type: 'number',
						},
					},
					nullable: true,
				},
			],
		});
	});
});
