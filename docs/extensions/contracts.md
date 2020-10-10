# Contracts

Auto-generate client queries and mutations (included fragments) from a given GraphQL schema.

## Usage

```graphql
# schema.graphql
type Todo {
  name: String!
}

type Query {
  getTodo(name: String!): Todo!
}
```

```js
import makeContracts from '@browserql/contracts';
import schema from './schema.graphql';

const contracts = makeContracts(schema);
const client = new ApolloClient(...)

client.query({
  query: contracts.Query.getTodo,
  variables: { name: 'joe' },
});
```
