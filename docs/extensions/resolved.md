# Resolved

```js
import gql from "graphql-tag";
import resolve from "@browserql/resolved";

const schema = gql`
  type Query {
    get(id: ID): Boolean
  }

  type Mutation {
    set(id: ID): Boolean
  }
`;

const resolved = resolve(schema);

apolloClient.query(resolved.Query.get({ id: "123" }));

apolloClient.mutate(resolved.Mutation.set({ id: "456" }));
```
