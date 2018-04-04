const structs = ['allOf', 'anyOf', 'oneOf', 'not', 'items', 'additionalProperties'];

function InvalidTypeError(message) {
	this.name = 'InvalidTypeError';
	this.message = message;
}

InvalidTypeError.prototype = new Error();

function convert(schema, options) {
	options = options || {};
	options.cloneSchema = ! (options.cloneSchema === false);

	if (options.cloneSchema) {
		schema = JSON.parse(JSON.stringify(schema));
	}

	delete schema['$schema'];
	schema = convertSchema(schema);

	return schema;
}

function convertSchema(schema) {
	let i = 0;
	let j = 0;
	let struct = null;

	for (i; i < structs.length; i++) {
		struct = structs[i];

		if (Array.isArray(schema[struct])) {
			for (j; j < schema[struct].length; j++) {
				schema[struct][j] = convertSchema(schema[struct][j]);
			}
		} else if (typeof schema[struct] === 'object') {
			schema[struct] = convertSchema(schema[struct]);
		}
	}

	if (typeof schema.properties === 'object') {
		schema.properties = convertProperties(schema.properties);

		if (Array.isArray(schema.required)) {
			schema.required = cleanRequired(schema.required, schema.properties);

			if (schema.required.length === 0) {
				delete schema.required;
			}
		}
		if (Object.keys(schema.properties).length === 0) {
			delete schema.properties;
		}

	}

	validateType(schema.type);
	schema = convertTypes(schema);

	if (typeof schema['patternProperties'] === 'object') {
		schema = convertPatternProperties(schema);
	}

	return schema;
}

function validateType(type) {
	const validTypes = ['null', 'boolean', 'object', 'array', 'number', 'string', 'integer'];
	const types = Array.isArray(type) ? type : [type];
	types.forEach(type => {
		if (validTypes.indexOf(type) < 0 && type !== undefined)
			throw new InvalidTypeError('Type "' + type + '" is not a valid type');
	});
}

function convertProperties(properties) {
	var key
		, property
		, props = {}
	;

	for (key in properties) {
		property = properties[key];
		props[key] = convertSchema(property);
	}

	return props;
}

function convertTypes(schema) {
	var newType;

	if (schema.type === undefined) {
		return schema;
	}

	// type needs to be a string, not an array
	if (schema.type instanceof Array && schema.type.includes('null')) {
		var numTypes = schema.type.length;

		schema.nullable = true;

		// if it was just type: ['null'] for some reason
		switch (numTypes) {
			case 1:
				// Didn't know what else to do
				newType = 'string';
				break;

			case 2:
				newType = schema.type.find(function(element) {
					return element !== 'null';
				});
				break;

			default:
				throw 'type cannot be an array, and you have ' + numTypes + ' types';
		}
	}

	if (newType) {
		schema.type = newType;
	}

	return schema;
}

// "patternProperties did not make it into OpenAPI v3.0"
// https://github.com/OAI/OpenAPI-Specification/issues/687
function convertPatternProperties(schema) {
	schema['x-patternProperties'] = schema['patternProperties'];
	delete schema['patternProperties'];
	return schema;
}

function cleanRequired(required, properties) {
	var i = 0;

	required = required || [];
	properties = properties || {};

	for (i; i < required.length; i++) {
		if (properties[required[i]] === undefined) {
			required.splice(i, 1);
		}
	}

	return required;
}

module.exports = convert;
