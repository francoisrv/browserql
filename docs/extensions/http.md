# http

```graphql
# schema.graphql

type Customer {
  id: ID!
  name: String!
}

type Query {
  getCustomer(id: ID!): Customer @get(url: "https://api.com/v1/customer")
}

type Mutation {
  addCustomer(name: String!): Customer @post(url: "https://api.com/v1/customer")
}
```

```jsx
import gql from 'graphql-tag';
import connect from '@browserql/client';
import { connectCache, withCache } from '@browserql/cache';
import connectHttp from '@browserql/http';

const connectedCache = connectCache(schema);

const cache = withCache(connect(connectCache(schema)));

function Customer() {
  const [customer, { loading, error }] = useHttp().query.getCustomer({
    id: props.id,
  });

  return <div>{customer.name}</div>;
}
```
