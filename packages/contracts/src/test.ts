import gql from 'graphql-tag';
import makeContracts from '.';

const schema = `
type Category {
  id: ID
}

type Todo {
  name: String!
  categories: [Category!]!
}

type Query {
  getTodo(name: String! id: ID!): Todo!
}

type Mutation {
  setTodo(name: String! id: ID!): Todo!
}
`;

const query = `query getTodoQuery(
  $name: String !
  $id: ID ! 
) {
  getTodo (
    name: $name
    id: $id 
   ) {
     ...TodoFragment
  }
}
fragment TodoFragment on Todo {
  name
  categories {
    ...CategoryFragment 
  }
}
fragment CategoryFragment on Category {
  id
}`;

const mutation = `mutation setTodoMutation(
  $name: String !
  $id: ID ! 
) {
  setTodo (
    name: $name
    id: $id 
   ) {
     ...TodoFragment
  }
}
fragment TodoFragment on Todo {
  name
  categories {
    ...CategoryFragment 
  }
}
fragment CategoryFragment on Category {
  id
}`;

const contracts = makeContracts(schema);

test('it should have queries', () => {
  expect(contracts).toHaveProperty('Query');
});

test('it should have mutations', () => {
  expect(contracts).toHaveProperty('Mutation');
});

test('it should have query', () => {
  expect(contracts.Query).toHaveProperty('getTodo');
  expect(contracts.Query.getTodo).toEqual(gql(query));
});

test('it should have mutation', () => {
  expect(contracts.Mutation).toHaveProperty('setTodo');
  expect(contracts.Mutation.setTodo).toEqual(gql(mutation));
});
