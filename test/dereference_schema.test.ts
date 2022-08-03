import convert from '../src';
import { join } from 'path';
import nock from 'nock';
import * as path from 'path';

it('not dereferencing schema by default', async ({ expect }) => {
	const schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		properties: {
			foo: {
				$ref: '#/definitions/foo',
			},
		},
		definitions: {
			foo: ['string', 'null'],
		},
	};

	const result = await convert(JSON.parse(JSON.stringify(schema)));

	const expected: any = { ...schema };
	if ('$schema' in expected) {
		delete expected.$schema;
	}
	expected.definitions = {
		foo: {
			type: 'string',
			nullable: true,
		},
	};

	expect(result).toEqual(expected);
});

it('dereferencing schema with deference option', async ({ expect }) => {
	const schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		type: {
			$ref: '#/definitions/foo',
		},
		definitions: {
			foo: ['string', 'null'],
		},
	};

	const result = await convert(schema, { dereference: true });

	const expected = {
		type: 'string',
		nullable: true,
		definitions: {
			foo: { type: 'string', nullable: true },
		},
	};

	expect(result).toEqual(expected);
});

it('dereferencing schema with deference option at root', async ({ expect }) => {
	const schema = {
		definitions: {
			AgilityServerWebServicesSDKServerServiceSVCJSONGetNavigationMenu2PostRequest:
				{
					type: 'object',
					additionalProperties: false,
					properties: {
						navigationMenuIdentity: {
							$ref: '#/definitions/NavigationMenuIdentity',
						},
						sessionId: {
							type: 'string',
						},
					},
					required: [],
					title:
						'AgilityServerWebServicesSDKServerServiceSVCJSONGetNavigationMenu2PostRequest',
				},
			NavigationMenuIdentity: {
				type: 'object',
				additionalProperties: false,
				properties: {
					Id: {
						type: 'string',
					},
					LastModifiedDate: {
						type: 'string',
					},
					Name: {
						type: 'string',
					},
					__type: {
						type: 'string',
					},
				},
				required: [],
				title: 'NavigationMenuIdentity',
			},
		},
		$ref: '#/definitions/AgilityServerWebServicesSDKServerServiceSVCJSONGetNavigationMenu2PostRequest',
	};

	const result = await convert(schema, { dereference: true });

	const expected = {
		type: 'object',
		additionalProperties: false,
		properties: {
			navigationMenuIdentity: {
				type: 'object',
				additionalProperties: false,
				properties: {
					Id: {
						type: 'string',
					},
					LastModifiedDate: {
						type: 'string',
					},
					Name: {
						type: 'string',
					},
					__type: {
						type: 'string',
					},
				},
				required: [],
				title: 'NavigationMenuIdentity',
			},
			sessionId: {
				type: 'string',
			},
		},
		required: [],
		title:
			'AgilityServerWebServicesSDKServerServiceSVCJSONGetNavigationMenu2PostRequest',
		definitions: {
			AgilityServerWebServicesSDKServerServiceSVCJSONGetNavigationMenu2PostRequest:
				{
					type: 'object',
					additionalProperties: false,
					properties: {
						navigationMenuIdentity: {
							type: 'object',
							additionalProperties: false,
							properties: {
								Id: {
									type: 'string',
								},
								LastModifiedDate: {
									type: 'string',
								},
								Name: {
									type: 'string',
								},
								__type: {
									type: 'string',
								},
							},
							required: [],
							title: 'NavigationMenuIdentity',
						},
						sessionId: {
							type: 'string',
						},
					},
					required: [],
					title:
						'AgilityServerWebServicesSDKServerServiceSVCJSONGetNavigationMenu2PostRequest',
				},
			NavigationMenuIdentity: {
				type: 'object',
				additionalProperties: false,
				properties: {
					Id: {
						type: 'string',
					},
					LastModifiedDate: {
						type: 'string',
					},
					Name: {
						type: 'string',
					},
					__type: {
						type: 'string',
					},
				},
				required: [],
				title: 'NavigationMenuIdentity',
			},
		},
	};

	expect(result).toEqual(expected);
});

it('dereferencing schema with remote http and https references', async ({
	expect,
}) => {
	nock('http://foo.bar/')
		.get('/schema.yaml')
		.replyWithFile(200, join(__dirname, 'fixtures/definitions.yaml'), {
			'Content-Type': 'application/yaml',
		});

	nock('https://baz.foo/')
		.get('/schema.yaml')
		.replyWithFile(200, join(__dirname, 'fixtures/definitions.yaml'), {
			'Content-Type': 'application/yaml',
		});

	const schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		allOf: [
			{ $ref: 'http://foo.bar/schema.yaml#/definitions/foo' },
			{ $ref: 'https://baz.foo/schema.yaml#/definitions/bar' },
		],
	};

	const result = await convert(schema, { dereference: true });

	const expected = {
		allOf: [{ type: 'string' }, { type: 'number' }],
	};

	expect(result).toEqual(expected);
});

it('dereferencing schema with file references', async ({ expect }) => {
	const fileRef = join(__dirname, 'fixtures/definitions.yaml#/definitions/bar');
	const unixStyle = path.resolve(fileRef).split(path.sep).join('/');
	const schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		allOf: [
			// points to current working directory, hence the `test` prefix
			{ $ref: './test/fixtures/definitions.yaml#/definitions/foo' },
			{ $ref: unixStyle },
		],
	};

	const result = await convert(schema, { dereference: true });

	const expected = {
		allOf: [{ type: 'string' }, { type: 'number' }],
	};

	expect(result).toEqual(expected);
});

it('throws an error when dereferecing fails', async ({ expect }) => {
	const schema = {
		$schema: 'http://json-schema.org/draft-04/schema#',
		properties: {
			foo: {
				$ref: './bad.json',
			},
		},
	};

	let error;
	try {
		await convert(schema, { dereference: true });
	} catch (e) {
		error = e;
	}

	expect(error).have.property('ioErrorCode', 'ENOENT');
});
