# browserql

Use graphql in the browser 🚀

## Abstract

Wouldn't it be cool to use [GraphQL](https://graphql.org/) as a state manager for browser apps?

Or have you ever worked in a front-end app that does not use GraphQL as a back-end and end up missing using Apollo to handle your state?

### Introducing browserql

You could benefit from GraphQL's schema syntax to model your data, and [Apollo's cache](https://www.apollographql.com/docs/react/caching/cache-interaction/) to store your data dynamically.

You could use a drop-in replacement for other state managements solutions such as [Redux](https://redux.js.org/).

Note that this is a solution in case you are **not** using GraphQL already in the back-end -- even though it should be possible to use both.

Use this for any other back-end management (http, sockets) -- if any at all.

## Concept

`browserql` relies heavily on Apollo's cache and differs from a regular Apollo client in the following:

- queries are synchronous actions that read from the cache
- mutations are asynchronous actions that write to the cache

## Usage

Let's use a todo app to illustrate:

```js
import connect from '@browserql/client';

// schema can be a string or a GraphQL Document Node object
const schema = `
```

```graphql
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
Mutations update the cache - note that mutations should always use MutationResult as return kind
"""
type Mutation {
  """
  Add a new todo in cache
  """
  addTodo(name: String!)
}
`;
```

```js
// Resolvers are for mutations only and cannot be applied to queries
// Since queries are cache accessors and have no side effects
const mutations = {
  async addTodo(todo, { client }) {
    const todos = client.query("getTodos");
    client.write("getTodos", {}, [...todos, todo]);
  },
};

// Create a new browserql client
const client = connect({ schema, mutations });

// You can now access the cache
client.query("getTodos"); // []

// And update the cache
await client.mutate("addTodo", { name: "Buy milk" });

// The cache is now updated
client.query("getTodos"); // [{ name: 'Buy milk' }]
```

```graphql
@firestore(collection: "todos") type Todo { name: String! }
```

```jsx
function Todos() {
  const [todos, { loading, error }] = useFirestore("Todo").get();

  if (error) {
    return <div>{error.message}</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.name}</li>
      ))}
    </ul>
  );
}

function addTodo() {
  const [value, setValue] = React.useState("");
  const [addTodo, { loading, error }] = useFirestore("Todo").add({
    name: value,
  });
  const handleSubmit = () => {
    addTodo({ name: value });
  };

  return (
    <>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <input type="submit" onClick={handleSubmit} />
    </>
  );
}

function App() {
  return (
    <>
      <Todos />
      <AddTodo />
    </>
  );
}

ReactDOM.render(
  <FirestoreProvider
    schema={gql`@firestore(collection: "todos") type Todo { name: String! }`}
  >
    <App />
  </FirestoreProvider>
);
```

```graphql
@rest(path: "/todos") type Todo { name: String! }
```

```jsx
function Todos() {
  const [todos, { loading, error }] = useRest("Todo").get();

  if (error) {
    return <div>{error.message}</div>;
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.name}</li>
      ))}
    </ul>
  );
}

function addTodo() {
  const [value, setValue] = React.useState("");
  const [addTodo, { loading, error }] = useRest("Todo").post({
    name: value,
  });
  const handleSubmit = () => {
    addTodo({ name: value });
  };

  return (
    <>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <input type="submit" onClick={handleSubmit} />
    </>
  );
}

function App() {
  return (
    <>
      <Todos />
      <AddTodo />
    </>
  );
}

ReactDOM.render(
  <FirestoreProvider
    schema={gql`@firestore(collection: "todos") type Todo { name: String! }`}
  >
    <App />
  </FirestoreProvider>
);
```

```graphql
type QueueItem {
  rank: Int!
  productVariantId: ID!
}

type ShippingAddress {
  streetAddress: String!
  city: String!
  state: String!
  zipCode: String!
}

type Customer {
  cid: ID!
  shippingAddress: ShippingAddress!
  queue: [QueueItem!]!
}

type Query {
  @get(path: "/customer")
  getCustomer(
    cid: ID!
    shop: String!
  ): Customer
}

type Mutation {
  @put
  setShippingAddress(
    cid: CID!
    shippingAddress: ShippingAddressInput!
  ): Customer

  @put
  addProductToQueue(
    cid: ID!
    productVariantId: ID!
  ): Customer

  @put
  removeProductFromQueue(
    cid: ID!
    productVariantId: ID!
  ): Customer

  @put
  reorderQueue(
    cid: ID!
    currentRank: Int!
    nextRank: Int!
  ): Customer
}
```

```jsx
const client = connect({ schema });
client.extend(
  http({
    baseUrl: "http://api.com/v1",
    retry: {
      maxAttempts: Infinity,
      strategy: http.STRATEGY,
    },
  })
);

function ShippingAddress(props) {
  const [setShippingAddress, { loading, error, data, called }] = useHttp(
    "setShippingAddress"
  );

  const handleSubmit = () => {
    setShippingAddress({
      cid: props.cid,
      shippingAddress: {
        streetAddress,
      },
    });
  };
}

function Customer(props) {
  const [customer, { loading, error }] = useHttp("getCustomer", props);
}
```

```graphql
@pubsub(event: "message")
type Message {
  message: String!
  user: ID!
}

@fireauth
type User


@firestore
type MultipleQA {
  question: String!
  options: [String!]!
  answer: Int!
}

@firestore
type Settings {
  mathQuestions: [ID!]!
}
```

```jsx
function Question(props) {
  const [{ question, answer: solution }, { loading, error }] = useFirestore(
    "MathQuestion"
  ).get(props.id);
  const [answer, setAnswer] = React.useState(0);
  const validate = () => {
    if (answer === solution) {
    }
  };

  return (
    <>
      <h1>{question}</h1>
      <input
        type="number"
        value={answer}
        onChange={(e) => setAnswer(Number(e.target.value))}
      />
      <button onClick={validate}>Validate</button>
    </>
  );
}

function Questions() {
  const [qas] = useFirestore("MultipleQA").get();
  const shuffle = range(mathQuestions);
}

const client = connect({ schema });
client.extend(
  pubsub({
    ws: "ws://api.com/v1",
    reconnect: Infinity,
  })
);

function Messages() {
  const [messages] = useSubscribe("Message");

  return (
    <ul>
      {messages.map(({ message }, index) => (
        <li key={index}>{message}</li>
      ))}
    </ul>
  );
}

function Messager(props) {
  const [publishMessage] = usePublish("Message");
  const [message, setMessage] = React.useState("");

  const handleSubmit = () => {
    publishMessage({ message });
  };

  return (
    <>
      <input type="text" value={message} />
      <input type="submit" onClick={handleSubmit} />
    </>
  );
}

function Customer(props) {
  const [customer, { loading, error }] = useHttp("getCustomer", props);
}
```
