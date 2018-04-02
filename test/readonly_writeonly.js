'use strict';

const convert = require('../');
const should = require('should');

it('maintain readOnly and writeOnly props', () => {
	const schema = {
		type: 'object',
		properties: {
			prop1: {
				type: 'string',
				readOnly: true
			},
			prop2: {
				type: 'string',
				writeOnly: true
			}
		}
	};

	const result = convert(schema);

	const expected = {
		type: 'object',
		properties: {
			prop1: {
				type: 'string',
				readOnly: true
			},
			prop2: {
				type: 'string',
				writeOnly: true
			}
		}
	};

	should(result).deepEqual(expected);
});

it('deep schema', () => {
	const schema = {
		type: 'object',
		required: ['prop1', 'prop2'],
		properties: {
			prop1: {
				type: 'string',
				readOnly: true
			},
			prop2: {
				allOf: [
					{
						type: 'object',
						required: ['prop3'],
						properties: {
							prop3: {
								type: 'object',
								readOnly: true
							}
						}
					},
					{
						type: 'object',
						properties: {
							prop4: {
								type: 'object',
								readOnly: true
							}
						}
					},
				]
			}
		}
	};

	const result = convert(schema);

	const expected = {
		type: 'object',
		required: ['prop1', 'prop2'],
		properties: {
			prop1: {
				type: 'string',
				readOnly: true
			},
			prop2: {
				allOf: [
					{
						type: 'object',
						required: ['prop3'],
						properties: {
							prop3: {
								type: 'object',
								readOnly: true
							}
						}
					},
					{
						type: 'object',
						properties: {
							prop4: {
								type: 'object',
								readOnly: true
							}
						}
					},
				]
			}
		}
	};

	should(result).deepEqual(expected);
});
