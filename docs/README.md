# bhrowserql

Use graphql in the browser 🚀

**browserql works better with [plugins](/plugins.md)**

## Why?

- 💪 powerful state management of your front-end app including offline via apollo cache
- 💡 easy-to-reason code layout thanks to graphql syntax
- 🤩 all-in-the-browser

## Usage

```js
import connect from '@browserql/client';

const schema = `
type Query {
  counter: Int!
}

type Mutation {
  incrementCounter: BResult
}
`;
const resolvers = {
  incrementCounter: async (client) => {
    const counter = client.query('counter');
    await client.write('counter', null, counter);
  },
};

const client = connect({ schema, resolvers });

const counter = client.query('counter');

console.log(counter.data); // 0

await client.mutate('incrementCounter');

console.log(counter.data); // 1
```

## Todo example

```graphql
type Todo {
  name: String!
  id: ID! @uuid
  done: Boolean!
}

type Query {
  getTodos: [Todo!]!
}

type Mutation {
  addTodo(todo: Todo!): BResult
  markTodoAsDone(id: ID!): BResult
}
```

```js
const mutations = {
  addTodo: (client, { todo }) =>
    client.write('getTodos', null, [...client.read('getTodos'), todo]),

  markTodoAsDone: (client, { id }) =>
    client.write(
      'getTodos',
      null,
      client.read('getTodos').map((todo) => ({
        ...todo,
        done: todo.id === id ? true : todo.done,
      }))
    ),
};
```

```js
client.query('getTodos');
// []

await client.mutate('addTodo', { todo: { name: 'Buy milk' } });

client.query('getTodos');
// [{ id: 'xxx', name: 'Buy milk', done: false }]

await client.mutate('markTodoAsDone', { id: 'xxx' });

client.query('getTodos');
// [{ id: 'xxx', name: 'Buy milk', done: true }]
```

## connect

```ts
declare function connect(options: ConnectOptions): BrowserQLClient;
```

### options

```ts
interface ConnectOptions {
  schema: Schema | Schema[];

  assumeValid?: boolean;
  plugins?: PluginCaller[];
  resolvers?: { [name: string]: Function };
}
```

#### schema

```ts
type Schema = DocumentNode | GraphQLSchema | string;
```

You can pass either a string, a document node or a graphQL schema object -- or an array with any of these three.

#### assumeValid

The schema needs te be valid, unless specified otherwise via the `assumeValid` option:

```js
connect({ schema, assumeValid: false });
```

#### plugins

Plugins can:

- extend schema
- extend resolvers
- extend context

```ts
type PluginCaller = (...args: any[]) => PluginInvoker;

type PluginInvoker = (
  schema: GraphQLSchema,
  resolvers: { [name: string]: Function },
  context: object
) => Plugin;

interface Plugin {
  schema: GraphQLSchema;
  resolvers: { [name: string]: Function };
  context: object;
}
```

```js
import {
  getTypesWithDirective,
  getName,
  printDirective,
  DIRECTIVE_LOCATION,
} from 'browserql-utils';

// Add an id field to a type
function modelDirective(schema) {
  return {
    schema: [
      printDirective('model', DIRECTIVE_LOCATION.OBJECT),
      ...getTypesWithDirective('model', schema).map(
        (type) => `extend type ${getName(type)} { id: ID! }`
      ),
    ],
  };
}

const schema = 'type Model @model { title: String! }';

const client = connect({ schema, plugins: [modelDirective] });

client.printType('Model');
// type Model {
//   id: ID!
//   title: String!
// }
```

#### resolvers

```js
const schema = `
type Query {
  ping: String
}

type Mutation {
  pong: string
}
`;
const resolvers = {
  ping: () => 'pong',
  pong: () => 'ping',
};

connect({ schema, resolvers });
```

### client

```ts
interface Client {
  apollo: ApolloProvider;

  getTransaction(name: string): Transaction;
  printQuery(): string;
  getContext(path?: string): object;
  getQuery(name: string): DocumentNode;
  getSchema(): GraphQLSchema;
  getResolvers(): object;
}
```

### members
