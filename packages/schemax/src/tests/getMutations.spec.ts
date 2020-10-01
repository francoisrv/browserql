import gql from 'graphql-tag';
import getName from '../lib/getName';
import enhanceSchema from '../schema';

const schema = enhanceSchema(gql`
  type Query {
    foo: ID
  }
  type Mutation {
    A: ID
    B: ID
  }
  extend type Mutation {
    C: ID
  }
`);

test('it should get all mutations', () => {
  const mutations = schema.getMutations();
  expect(mutations).toHaveLength(3);
  expect(getName(mutations[0])).toEqual('A');
  expect(getName(mutations[1])).toEqual('B');
  expect(getName(mutations[2])).toEqual('C');
});

test('it should get all mutations, except extended', () => {
  const mutations = schema.getMutations({ includeExtended: false });
  expect(mutations).toHaveLength(2);
  expect(getName(mutations[0])).toEqual('A');
  expect(getName(mutations[1])).toEqual('B');
});

test('it should get only extended mutations', () => {
  const mutations = schema.getMutations({ extendedOnly: true });
  expect(mutations).toHaveLength(1);
  expect(getName(mutations[0])).toEqual('C');
});
