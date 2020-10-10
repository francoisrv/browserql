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

test('it should get all queries', () => {
  const queries = schema.getQueries();
  expect(queries).toHaveLength(3);
  expect(getName(queries[0])).toEqual('foo');
  expect(getName(queries[1])).toEqual('bar');
  expect(getName(queries[2])).toEqual('barz');
});

test('it should get all queries, except extended', () => {
  const queries = schema.getQueries({ includeExtended: false });
  expect(queries).toHaveLength(2);
  expect(getName(queries[0])).toEqual('foo');
  expect(getName(queries[1])).toEqual('bar');
});

test('it should get only extended queries', () => {
  const queries = schema.getQueries({ extendedOnly: true });
  expect(queries).toHaveLength(1);
  expect(getName(queries[0])).toEqual('barz');
});
