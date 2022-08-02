import type { JSONSchema } from '@apidevtools/json-schema-ref-parser';
import type $RefParser from '@apidevtools/json-schema-ref-parser';

export type addPrefixToObject<T> = {
	[K in keyof JSONSchema as `x-${K}`]: JSONSchema[K];
};

export interface Options {
	cloneSchema?: boolean;
	dereference?: boolean;
	dereferenceOptions?: $RefParser.Options;
}
type ExtendedJSONSchema = addPrefixToObject<JSONSchema> & JSONSchema;
export type SchemaType = ExtendedJSONSchema & {
	example?: JSONSchema['examples'][number];
	'x-patternProperties'?: JSONSchema['patternProperties'];
	nullable?: boolean;
};
export type SchemaTypeKeys = keyof SchemaType;
