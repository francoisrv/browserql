# Connect

Create a new browserql client

## Usage

Call connect with [ConnectOptions](https://github.com/francoisrv/browserql/blob/master/packages/client/src/types/ConnectOptions.ts)

```js
const { client } = connect(ConnectOptions) // ApolloClient
```

## Options

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

## Extensions

You can pass different schemas along with their resolvers by queuing them.

Each middleware receive the current schema along with tits resolvers

```js
const main = {
  schema: gql`
    type Todo {
      id: ID!
    }

    type Query {
      getTodo: Todo
    }
  `,
  queries: {
    getTodo() {
      // ....
    },
  },
}

const extension = () => ({
  schema: gql`
    type Customer {
      id: ID!
    }

    type Query {
      getCustomer: Customer
    }
  `,
  queries: {
    getCustomer() {
      // ....
    },
  },
})

const { client, schema, queries } = connect(main, extension)
```
