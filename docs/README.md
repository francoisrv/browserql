# browserql

Use graphql in the browser 🚀

## Usage

```js
import connect from "@browserql/client";

const schema = `
type Todo {
  name: String!
}

type Query {
  getTodos: [Todo!]!
}

type Mutation {
  addToDo(name: String!): MutationResult
}
`;

const resolvers = {
  addTodo(client) {
    return async ({ name }) => {
      const todos = client.read("getTodos");
      client.write("getTodos", {}, [...todos, { name }]);
    };
  },
};

const client = connect({ schema, resolvers });

let todos = client.query("getTodos");

console.log(todos); // []

await client.mutate("addTodo", { name: "Buy milk" });

todos = client.query("getTodos");

console.log(todos); // [{ name: 'Buy milk' }]
```
