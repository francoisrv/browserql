import gql from 'graphql-tag';
import getName from '../lib/getName';
import enhanceSchema from '../schema';

const schema = enhanceSchema(gql`
  type Foo {
    bar: Int!
  }

  type Barz {
    bar: Int!
  }

  enum Other {
    FOO
    BAR
  }

  type Query {
    get: Foo
  }
`);

test('it should get all types', () => {
  const types = schema.getTypes();
  expect(getName(types[0])).toEqual('Foo');
  expect(getName(types[1])).toEqual('Barz');
});
