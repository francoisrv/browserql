import gql from 'graphql-tag';
import getName from '../lib/getName';
import enhanceSchema from '../schema';

const schema = enhanceSchema(gql`
  type Query {
    A: ID
  }
  type Mutation {
    B: ID
  }
  extend type Mutation {
    C: ID
  }
`);

test('it should get mutation by name', () => {
  const mutation = schema.getMutation('B');
  expect(getName(mutation)).toEqual('B');
});

test('it should get extended mutation by name', () => {
  const mutation = schema.getMutation('C');
  expect(getName(mutation)).toEqual('C');
});
