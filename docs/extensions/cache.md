# Cache

```js
import gql from 'graphql-tag';
import connect from '@browserql/client';
import { useCache, withCache } from '@browserql/cache';

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

await cache.mutate.addTodo({ name: 'Buy milk' });

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

const [isConnected, { toggle }] = useCache().isConnected();

//
cache.query.getSteps(); // 0
await cache.increment(10).getSteps();
cache.query.getSteps(); // 10

const [steps, { increment }] = useCache().getSteps();

//
cache.query.getOptions(); // []
await cache.push(10).getOptions();
cache.query.getOptions(); // [10]
```

```jsx
import React from 'react';
import { render } from 'react-dom';
import { Provider, useCache } from '@browserql/cache-react';
import { connectCache, withCache } from '@browserql/cache';
import gql from 'graphql-tag';

const schema = gql`
  type Query {
    isConnected: Boolean!
    getSteps: Int!
  }
`;

const client = connect(connectCache(schema));
const cache = withCache(client);

function Connector() {
  const [connected, { toggle }] = useCache('isConnected');

  return (
    <button onClick={toggle.execute} disabled={toggle.loading}>
      {connected ? 'Is connected' : 'Is not connected'}
    </button>
  );
}

function Steps() {
  const [steps, { increment }] = useCache('getSteps');
  const handleClick = () => increment.execute(10);

  return (
    <button onClick={handleClick} disabled={increment.loading}>
      {steps}
    </button>
  );
}

render(
  <Provider schema={schema}>
    <>
      <Connector />
      <Steps />
    </>
  </Provider>
);
```
