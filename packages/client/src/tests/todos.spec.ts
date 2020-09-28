import gql from 'graphql-tag';
import connect from '../connect';

interface Todo {
  name: string;
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

let todos: { name: string }[] = [];

const { apollo: client } = connect({
  schema: gql`
    type Todo {
      name: String!
    }

    type Query {
      getTodos: [Todo!]!
    }

    type Mutation {
      addTodo(name: String!): Todo
    }
  `,
  queries: {
    async getTodos() {
      await wait(250);
      return todos;
    },
  },
  mutations: {
    async addTodo(todo: { name: string }) {
      await wait(250);
      todos.push(todo);
      return todo;
    },
  },
});

test('it should get initial state from cache', async () => {
  const { data } = await client.query({
    query: gql`
      query {
        getTodos {
          name
        }
      }
    `,
  });
  expect(data.getTodos).toEqual([]);
});

test('it should update cache', async () => {
  await client.mutate({
    mutation: gql`
      mutation addTodoMutation($name: String!) {
        addTodo(name: $name) {
          name
        }
      }
    `,
    variables: {
      name: 'Buy milk',
    },
  });
});

test('it should get updated state from cache', async () => {
  const { data } = await client.query({
    query: gql`
      query {
        getTodos {
          name
        }
      }
    `,
    fetchPolicy: 'no-cache',
  });
  expect(data.getTodos).toEqual([{ name: 'Buy milk', __typename: 'Todo' }]);
});
