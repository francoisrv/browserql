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

test('it should get Foo', () => {
  const Foo = schema.getByName('Foo');
  expect(getName(Foo)).toEqual('Foo');
});

test('it should get Other', () => {
  const Other = schema.getByName('Other');
  expect(getName(Other)).toEqual('Other');
});
