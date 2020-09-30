# Contracts

Auto-generate client queries and mutations (included fragments) from a given GraphQL schema.

## Usage

```graphql
type Todo {
  name: String!
}

type Query {
  getTodo(name: String!): Todo!
}
```

### Simple usage

```js
import { makeContracts } from '@browserql/contracts';
import schema from './schema.graphql';

const contracts = makeContracts(schema);
const client = new ApolloClient(...)

client.query({
  query: contracts.Query.getTodo,
  variables: { name: 'joe' },
});
```

### With browserql

```js
import connect from '@browserql/client';
import { extendContracts } from '@browserql/contracts';

import schema from './schema.graphql';

const client = connect({
  schema,
  extensions: { contracts: extendContracts() },
});

const {
  apollo,
  extensions: { contracts },
} = client;

apollo.query({
  query: contracts.Query.getTodo,
  variables: { name: 'joe' },
});
```
