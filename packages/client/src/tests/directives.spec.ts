import type { GraphQLEnumValue, GraphQLField } from 'graphql'

import gql from 'graphql-tag'
import { SchemaDirectiveVisitor } from 'graphql-tools'

import connect from '../connect'

test('it should get query', async () => {
  class DeprecatedDirective extends SchemaDirectiveVisitor {
    public constructor(config: any) {
      super(config)
    }

    public visitFieldDefinition(field: GraphQLField<any, any>) {
      // console.log({ field });
      field.isDeprecated = true
      field.deprecationReason = this.args.reason
    }

    public visitEnumValue(value: GraphQLEnumValue) {
      // console.log({ value });
      value.isDeprecated = true
      value.deprecationReason = this.args.reason
    }
  }

  const schema = gql`
    directive @deprecated(
      reason: String = "No longer supported"
    ) on FIELD_DEFINITION | ENUM_VALUE

    extend type Query {
      hello: String! @deprecated
    }
  `

  const { client } = connect({
    schema,
    directives: {
      deprecated: DeprecatedDirective,
    },
    queries: {
      hello() {
        return 'hello'
      },
    },
  })

  const { data } = await client.query({
    query: gql`
      query {
        hello
      }
    `,
  })
  expect(data.hello).toEqual('hello')
})

test('it should get query', async () => {
  class FooDirective extends SchemaDirectiveVisitor {
    public constructor(config: any) {
      super(config)
    }

    public visitFieldDefinition(field: GraphQLField<any, any>) {
      console.log({ field });
      field.isDeprecated = true
      field.deprecationReason = this.args.reason
    }

    public visitEnumValue(value: GraphQLEnumValue) {
      // console.log({ value });
      value.isDeprecated = true;
      value.deprecationReason = this.args.reason;
    }
  }

  const schema = gql`
    directive @foo(
      reason: String = "No longer supported"
    ) on FIELD_DEFINITION | ENUM_VALUE

    extend type Query {
      hello: String! @foo
    }
  `

  const { client } = connect({
    schema,
    directives: {
      foo: FooDirective,
    },
    queries: {
      hello() {
        return 'hello'
      },
    },
  })

  const { data } = await client.query({
    query: gql`
      query {
        hello
      }
    `,
  })
  expect(data.hello).toEqual('hello')
})
