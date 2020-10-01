# Cache

```js
import gql from "graphql-tag";
import connect from "@browserql/client";
import { useCache, withCache } from "@browserql/cache";

const schema = gql`
  type Todo {
    name: String!
  }

  type Query {
    getTodos: [Todo]
  }

  type Mutation {
    addTodo(name: String!): CacheMutation @push(query: "getTodos")
  }
`;

const client = connect(useCache(schema, { mutations: { addTodo } }));

const cache = withCache(client);

//

cache.query.getTodos(); // []

await cache.mutate.addTodo({ name: "Buy milk" });

cache.query.getTodos(); // [{ name: 'Buy milk' }]
```

```js
const schema = gql`
  type Query {
    isConnected: Boolean!
    getSteps: Int!
    getOptions: [Int]!
  }
`;

const cache = withCache(connect(useCache(schema)));

//
cache.query.isConnected(); // false
await cache.toggle.isConnected();
cache.query.isConnected(); // true

//
cache.query.getSteps(); // 0
await cache.increment(10).getSteps();
cache.query.getSteps(); // 10

//
cache.query.getOptions(); // []
await cache.push(10).getOptions();
cache.query.getOptions(); // [10]
```
