declare namespace JsonSchemaToOpenapiSchema {
  interface Options {
    cloneSchema?: boolean;
    dereference?: boolean;
  }
}
declare function JsonSchemaToOpenapiSchema<T = Record<string | number, any>>(
  schema: Record<string | number, any>,
  options?: JsonSchemaToOpenapiSchema.Options
): Promise<T>;
export = JsonSchemaToOpenapiSchema;
