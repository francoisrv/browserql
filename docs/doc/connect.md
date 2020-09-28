# Connect

Create a new browserql client

## Usage

```js
const client = connect(ConnectOptions);
```

## Options

View [here](https://github.com/francoisrv/browserql/blob/master/packages/client/src/types/ConnectOptions.ts)

```ts
export interface ConnectOptions {
  directives?: Dictionary<GraphQLDirective>;
  mutations?: Dictionary<GraphQLOperation>;
  queries?: Dictionary<GraphQLOperation>;
  scalars?: Dictionary<GraphQLScalar>;
  schema: DocumentNode | string;
}
```

## Schema

Schema can be either a string or a document node:

```js
const schema = 'type Query { hello: String }';

// Or
import gql from 'graphql-tag';
const schema = gql`
  type Query {
    hello: String
  }
`;

const client = connect({ schema });
```

## Resolvers

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

const client = connect({ schema, queries, mutations, scalars });
```
