import gql from 'graphql-tag'

import { GraphQLEnumValue, GraphQLField } from 'graphql'
import { SchemaDirectiveVisitor } from 'graphql-tools'

import connect from '../connect'

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

test('it should get query', async () => {
  const { data } = await client.query({
    query: gql`
      query {
        hello
      }
    `,
  })
  expect(data.hello).toEqual('hello')
})
