# Connect

Create a new browserql client

## Usage

You call it with a spread array of arguments. Each argument must be a Schemaql object or a function - that is given a Schemaql object and returns a Schemaql object.

```js
function connect(
  (...args: Array<Schemaql | ((s: Schemaql) => SchemaQL)>)
): Schemaql & { apollo: ApolloServer }
```

## Schemaql

### Schema

Schema can be either a string or a document node:

```js
const schema = 'type Query { hello: String }'

// Or
import gql from 'graphql-tag'
const schema = gql`
  type Query {
    hello: String
  }
`

const { client } = connect({ schema })
```

### Resolvers

The following resolvers are accepted:

- [x] Queries
- [x] Mutations
- [x] Scalars
- [x] Directives

```js
import gql from 'graphql-tag';
import GraphQLJSON from 'graphql-type-json';
import { DeprecatedDirective } from 'graphql-directive-deprecated';
import connect from '@browserql/client';

const schema = gql`
  scalar JSON

  directive @deprecated(
    reason: String = "No longer supported"
  ) on FIELD_DEFINITION | ENUM_VALUE

  type Foo {
    json: JSON @deprecated(reason: "Use newField.")
  }

  type Query {
    getFoo(json: JSON!): Foo
  }

  type Mutation {
    setFoo(json: JSON!): Foo
  }
`;

const queries = {
  getFoo({ json }) {
    return { json };
  },
};

const mutations = {
  setFoo({ json }) {
    return { json };
  },
};

const scalars = {
  JSON: GraphQLJSON,
};

const directives: {
  deprecated: DeprecatedDirective,
};

const { client } = connect({ schema, queries, mutations, scalars });
```
