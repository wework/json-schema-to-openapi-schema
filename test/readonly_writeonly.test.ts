import convert from '../src';

it('maintain readOnly and writeOnly props', async ({ expect }) => {
	const schema = {
		type: 'object',
		properties: {
			prop1: {
				type: 'string',
				readOnly: true,
			},
			prop2: {
				type: 'string',
				writeOnly: true,
			},
		},
	};

	const result = await convert(schema);

	const expected = {
		type: 'object',
		properties: {
			prop1: {
				type: 'string',
				readOnly: true,
			},
			prop2: {
				type: 'string',
				writeOnly: true,
			},
		},
	};

	expect(result).toEqual(expected);
});

it('deep schema', async ({ expect }) => {
	const schema = {
		type: 'object',
		required: ['prop1', 'prop2'],
		properties: {
			prop1: {
				type: 'string',
				readOnly: true,
			},
			prop2: {
				allOf: [
					{
						type: 'object',
						required: ['prop3'],
						properties: {
							prop3: {
								type: 'object',
								readOnly: true,
							},
						},
					},
					{
						type: 'object',
						properties: {
							prop4: {
								type: 'object',
								readOnly: true,
							},
						},
					},
				],
			},
		},
	};

	const result = await convert(schema);

	const expected = {
		type: 'object',
		required: ['prop1', 'prop2'],
		properties: {
			prop1: {
				type: 'string',
				readOnly: true,
			},
			prop2: {
				allOf: [
					{
						type: 'object',
						required: ['prop3'],
						properties: {
							prop3: {
								type: 'object',
								readOnly: true,
							},
						},
					},
					{
						type: 'object',
						properties: {
							prop4: {
								type: 'object',
								readOnly: true,
							},
						},
					},
				],
			},
		},
	};

	expect(result).toEqual(expected);
});
