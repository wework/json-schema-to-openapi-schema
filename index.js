const schemaWalker = require('@cloudflare/json-schema-walker');

function InvalidTypeError(message) {
	this.name = 'InvalidTypeError';
	this.message = message;
}

InvalidTypeError.prototype = new Error();

function convert(schema, options = {}) {
	const { cloneSchema = true } = options;

	if (cloneSchema) {
		schema = JSON.parse(JSON.stringify(schema));
	}

	const vocab = schemaWalker.getVocabulary(schema, schemaWalker.vocabularies.DRAFT_04);
	schemaWalker.schemaWalk(schema, convertSchema, null, vocab);
	return schema;
}

function stripIllegalKeywords(schema) {
	delete schema['$schema'];
	delete schema['$id'];
	delete schema['id'];
	return schema;
}

function convertSchema(schema, path, parent, parentPath) {
	schema = stripIllegalKeywords(schema);
	schema = convertTypes(schema);
	schema = rewriteConst(schema);
	schema = convertDependencies(schema);
	schema = rewriteIfThenElse(schema);
        schema = rewriteExclusiveMinMax(schema);
        schema = convertExamples(schema);

	if (typeof schema['patternProperties'] === 'object') {
		schema = convertPatternProperties(schema);
	}

	if (schema.type === 'array' && typeof schema.items === 'undefined') {
		schema.items = {};
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

function convertDependencies(schema) {
	const deps = schema.dependencies;
	if (typeof deps !== 'object') {
		return schema;
	}

	// Turns the dependencies keyword into an allOf of oneOf's
	// "dependencies": {
	// 		"post-office-box": ["street-address"]
	// },
	//
	// becomes
	//
	// "allOf": [
	// 	{
	// 		"oneOf": [
	// 			{"not": {"required": ["post-office-box"]}},
	// 			{"required": ["post-office-box", "street-address"]}
	// 		]
	// 	}
	//

	delete schema['dependencies'];
	if (!Array.isArray(schema.allOf)) {
		schema.allOf = [];
	}

	for (const key in deps) {
		const foo = {
			'oneOf': [
				{
					'not': {
						'required': [key]
					}
				},
				{
					'required': [].concat(key, deps[key])
				}
			]
		};
		schema.allOf.push(foo);
	}
	return schema;
}

function convertTypes(schema) {
	if (schema.type === undefined) {
		return schema;
	}

	validateType(schema.type);

	if (Array.isArray(schema.type)) {

		if (schema.type.length > 2 || !schema.type.includes('null')) {
			throw new Error('Type of ' + schema.type.join(',') + ' is too confusing for OpenAPI to understand. Found in ' + JSON.stringify(schema));
		}

		switch (schema.type.length) {
			case 0:
				delete schema.type;
				break;

			case 1:
				if (schema.type === 'null') {
					schema.nullable = true;
				}
				else {
					schema.type = schema.type[0];
				}
				break;

			default:
				schema.type = schema.type.find(type => type !== 'null');
				schema.nullable = true;
		}
	}
	else if (schema.type === 'null') {
		delete schema.type;
		schema.nullable = true;
	}

	return schema;
}

// "patternProperties did not make it into OpenAPI v3.0"
// https://github.com/OAI/OpenAPI-Specification/issues/687
function convertPatternProperties(schema) {
	schema['x-patternProperties'] = schema['patternProperties'];
	delete schema['patternProperties'];
	if (typeof schema.additionalProperties === 'undefined') schema.additionalProperties = true;
	return schema;
}

function convertExamples(schema) {
  if (schema['examples'] && Array.isArray(schema['examples'])) {
    schema['example'] = schema['examples'][0];
    delete schema['examples'];
  }

  return schema;
}

function rewriteConst(schema) {
	if (schema.const) {
		schema.enum = [ schema.const ];
		delete schema.const;
	}
	return schema;
}

function rewriteIfThenElse(schema) {
/* @handrews https://github.com/OAI/OpenAPI-Specification/pull/1766#issuecomment-442652805
if and the *Of keywords

There is a really easy solution for implementations, which is that

if: X, then: Y, else: Z

is equivalent to

oneOf: [allOf: [X, Y], allOf: [not: X, Z]]
*/
	if (schema.if && schema.then) {
		schema.oneOf = [ { allOf: [ schema.if, schema.then ] },
				 { allOf: [ { not: schema.if }, schema.else ] } ];
		delete schema.if;
		delete schema.then;
		delete schema.else;
  }
	return schema;
}

function rewriteExclusiveMinMax(schema) {
	if (typeof schema.exclusiveMaximum === 'number') {
		schema.maximum = schema.exclusiveMaximum;
		schema.exclusiveMaximum = true;
	}
	if (typeof schema.exclusiveMinimum === 'number') {
		schema.minimum = schema.exclusiveMinimum;
		schema.exclusiveMinimum = true;
	}
	return schema;
}

module.exports = convert;
