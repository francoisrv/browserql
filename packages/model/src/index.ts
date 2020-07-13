import { Plugin, Schema } from '@browserql/client'
import gql from 'graphql-tag'

export default function plugin(): Plugin {
  return function ({ schema }) {
    const types = schema.types.getTypesWithDirective('model')
    for (const type of types) {
      const name = Schema.getName(type)

      schema.directives.addDirective(gql`
      directive @model on OBJECT_DEFINITION
      `)

      schema.enumerations.addEnum(gql`
      enum Model_WhereOperator {
        EQUALS
        EQUALS_NOT
        IN
        NOT_IN
        MATCHES
        MATCHES_NOT
        HAS
        HAS_NOT
        GREATER_THAN
        LESSER_THAN
        GREATER_THAN_OR_EQUAL
        LESSER_THAN_OR_EQUAL
      } 
      `)

      schema.enumerations.addEnum(gql`
      enum Model_Order {
        ASC
        DESC
      } 
      `)

      schema.inputs.addInput(gql`
      input Model_Where {
        field: String!
        operator: Model_WhereOperator!
        value: JSON!
      }
      `)

      schema.inputs.addInput(gql`
      input Model_OrderBy {
        field: String!
        order: Model_Order
      }
      `)

      schema.inputs.addInput(gql`
      input Model_Adder {
        field: String!
        value: JSON!
      }
      `)
      
      schema.queries.addQuery(gql`
      type Query {
        Model_${ name }_viewOne(
          where: [Model_Where]
          skip: Int
          orderBy: Model_OrderBy
        ): ${ name }

        Model_${ name }_viewMany(
          where: [Model_Where]
          limit: Int
          skip: Int
          orderBy: Model_OrderBy
        ):: [${ name }]!
      }
      `)
      
      schema.mutations.addMutation(gql`
      type Mutation {
        Model_${ name }_addOne(
          input: [Model_Adder]!
        ): ${ name }

        Model_${ name }_addMany(
          input: [[Model_Adder]]!
        ): [${ name }]

        Model_${ name }_updateOne: ${ name }

        Model_${ name }_updateMany: [${ name }]

        Model_${ name }_deleteOne: ${ name }

        Model_${ name }_deleteMany: [${ name }]
      }
      `)
    }
    return {
      context: {}
    }
  }
}
