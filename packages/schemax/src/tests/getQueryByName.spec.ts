import gql from 'graphql-tag';
import getName from '../lib/getName';
import enhanceSchema from '../schema';

const schema = enhanceSchema(gql`
  type Query {
    foo: ID
    bar: ID
  }
  extend type Query {
    barz: ID
  }
`);

test('it should get query by name', () => {
  const query = schema.getQuery('foo');
  expect(getName(query)).toEqual('foo');
});

test('it should get extended query by name', () => {
  const query = schema.getQuery('barz');
  expect(getName(query)).toEqual('barz');
});
