# Connect

Create a new browserql client

## Usage

```js
const client = connect(ConnectOptions);
```

## Options

View [here](https://github.com/francoisrv/browserql/blob/master/packages/client/src/types.ts)

```ts
export interface ConnectOptions {
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
- [ ] Directives (support coming soon)

```js
import gql from 'graphql-tag';
import GraphQLJSON from 'graphql-type-json';
import connect from '@browserql/client';

const schema = gql`
  scalar JSON

  type Foo {
    json: JSON
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

const client = connect({ schema, queries, mutations, scalars });
```
