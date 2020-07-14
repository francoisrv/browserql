import { Plugin, Schema } from '@browserql/client'
import gql from 'graphql-tag'

export default function plugin(): Plugin {
  return function ({ schema, mutations }) {
    schema.extend(gql`
    directive @model on OBJECT

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

    enum Model_Order {
      ASC
      DESC
    }

    enum Model_SetOperator {
      SET
      INCREMENT
      DECREMENT
      MULTIPLY
      DIVIDE
    }

    input Model_Where {
      field: String!
      operator: Model_WhereOperator!
      value: JSON!
    }

    input Model_OrderBy {
      field: String!
      order: Model_Order
    }

    input Model_Adder {
      field: String!
      value: JSON!
    }

    input Model_Set {
      field: String
      operator: Model_SetOperator!
      value: JSON
    }
    
    `)

    const types = schema.types.getTypesWithDirective('model')
    for (const type of types) {
      const name = Schema.getName(type)
      
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
        ): [${ name }]!
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

        Model_${ name }_updateOne(
          getter: [Model_Where]
          setter: Model_Set
        ): ${ name }

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
