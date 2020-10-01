# Resolved

```js
import gql from "graphql-tag";
import resolve from "@browserql/resolve";

const schema = gql`
  type Query {
    foo(id: ID): Boolean
  }
`;

const resolved = resolve(schema);

apolloClient.query(resolved.Query.foo({ id: "123" }));
```
