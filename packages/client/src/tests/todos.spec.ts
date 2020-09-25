import gql from 'graphql-tag';
import connect from '../connect';

const client = connect({
  schema: gql`
    """
    The Todo model
    """
    type Todo {
      name: String!
    }

    """
    Queries access the cache
    """
    type Query {
      """
      Get all todos in cache
      """
      getTodos: [Todo!]!
    }

    """
    Mutations update the cache - note that mutations always return a MutationResult object
    """
    type Mutation {
      """
      Add a new todo in cache
      """
      addTodo(name: String!): MutationResult
    }
  `,
  mutations: {
    async addTodo({ name }, { client }) {
      const todos = client.query('getTodos');
      console.log('jeffrey', todos);
      client.write('getTodos', {}, [
        ...todos,
        {
          __typename: 'Todo',
          name,
        },
      ]);
    },
  },
});

test('it should get initial state from cache', () => {
  const todos = client.query('getTodos');
  expect(todos).toEqual([]);
});

test('it should update cache', async () => {
  await client.mutate('addTodo', { name: 'Buy milk' });
});

test('it should get updated state from cache', () => {
  const todos = client.query('getTodos');
  expect(todos).toEqual([{ name: 'Buy milk', __typename: 'Todo' }]);
});
