'use strict';

const convert = require('../');
const should = require('should');

it('strips $id from all subschemas not just root`', () => {
	const schema = {
    $id: "https://foo/bla",
    $schema: "http://json-schema.org/draft-06/schema#",
    type: "object",
    properties: {
      foo: {
        $id: "/properties/foo",
        type: "array",
        items: {
          $id: "/properties/foo/items",
          type: "object",
          properties: {
            id: {
              $id: "/properties/foo/items/properties/id",
              type: "string",
            }
					}
        }
			}
    }
	};

	const result = convert(schema);

	should(result).deepEqual({
    type: "object",
    properties: {
      foo: {
        type: "array",
        items: {
          type: "object",
          properties: {
            id: {
              type: "string",
            }
					}
        }
			}
    }
	});
});
