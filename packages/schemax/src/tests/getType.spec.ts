import gql from 'graphql-tag';
import getName from '../lib/getName';
import enhanceSchema from '../schema';

const schema = enhanceSchema(gql`
  type Foo {
    id: ID!
  }
  type Barz {
    id: ID!
  }
`);

test('it should get type by name', () => {
  const Foo = schema.getType('Foo');
  expect(getName(Foo)).toEqual('Foo');
});
