import gql from 'graphql-tag';
import connect from '../connect';

const schema = gql`
  type Query {
    hello: String!
  }
`;

const extensions = {
  test: () => ({ foo: 1 }),
};

const client = connect({ schema, extensions });

test('it should return extensions', () => {
  expect(client).toHaveProperty('extensions', {
    test: { foo: 1 },
  });
});
