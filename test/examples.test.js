'use strict';

const convert = require('../');
const should = require('should');

it('uses the first example from a schema', async () => {
  const schema = {
    $schema: 'http://json-schema.org/draft-06/schema#',
    examples: [
      'foo',
      'bar'
    ]
  };

  const result = await convert(schema);

  should(result).deepEqual({
    example: 'foo',
  });
});
