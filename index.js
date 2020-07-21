'use strict';

const schemaWalker = require('@cloudflare/json-schema-walker');
const { Resolver } = require('@stoplight/json-ref-resolver');
const { parse } = require('@stoplight/yaml');
const fetch = require('node-fetch');
const fs = require('fs');
const readFileAsync = require('util').promisify(fs.readFile);
const oas3schema = require('./refs/oas3-schema.json');

function InvalidTypeError(message) {
	this.name = 'InvalidTypeError';
	this.message = message;
}

InvalidTypeError.prototype = new Error();

async function convert(schema, options = {}) {
	const { cloneSchema = true, dereference = false } = options;

	if (cloneSchema) {
		schema = JSON.parse(JSON.stringify(schema));
	}

	if (dereference) {
		({ result: schema } = await resolver.resolve(schema));
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

  // should be called last
  schema = convertIllegalKeywordsAsExtensions(schema);
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
		if (schema.type.includes('null')) {
			schema.nullable = true;
		}
		const typesWithoutNull = schema.type.filter(type => type !== 'null');
		if (typesWithoutNull.length === 0) {
			delete schema.type
		} else if (typesWithoutNull.length === 1) {
			schema.type = typesWithoutNull[0];
		} else {
			delete schema.type;
			schema.anyOf = typesWithoutNull.map(type => ({ type }));
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

// keywords (or property names) that are not recognized within OAS3 are rewritten into extensions.
function convertIllegalKeywordsAsExtensions(schema) {
  Object.keys(schema)
    .filter(keyword => !keyword.startsWith(oasExtensionPrefix) && !allowedKeywords.includes(keyword))
    .forEach(keyword => {
      schema[oasExtensionPrefix + keyword] = schema[keyword];
      delete schema[keyword];
    });
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
	if (Object.hasOwnProperty.call(schema, 'const')) {
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

const httpReader = {
	async resolve(ref) {
		return (await fetch(String(ref))).text();
	},
};

const resolver = new Resolver({
	resolvers: {
		http: httpReader,
		https: httpReader,
		file: {
			resolve(ref) {
				return readFileAsync(ref.path(), 'utf8');
			},
		},
	},

	transformDereferenceResult(opts) {
		// this should not be needed, but unfortunately is due to a quirk in json-ref-resolver returning sealed object
		opts.result = JSON.parse(JSON.stringify(opts.result));
		return opts;
	},

	parseResolveResult(opts) {
		try {
			opts.result = parse(opts.result);
		} catch {
			// let's carry on
		}

		return opts;
	},
});

const oasExtensionPrefix = 'x-';

// TODO: having definitions inside an oas3 schema isn't exactly valid,
// maybe it is an idea to extract and split them into multiple oas3 schemas and reference to them.
// For now leaving as is.
const allowedKeywords = ['$ref', 'definitions'].concat(Object.keys(oas3schema.definitions.Schema.properties));

module.exports = convert;
