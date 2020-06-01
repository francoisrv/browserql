import { DocumentNode, GraphQLSchema, isObjectType, GraphQLField } from 'graphql'
import gql from 'graphql-tag'
import { set, find } from 'lodash'

interface State {
  [type: string]: {
    [field: string]: {
      field: GraphQLField<any, any>,
      value: any
    }
  }
}

export default function browserqlPluginState(
  schema: GraphQLSchema,
  resolvers: any
) {
  const state: State = {}
  const types = schema.getTypeMap()
  for (const name in types) {
    const type = types[name]
    if (
      isObjectType(type) &&
      name !== 'Query' &&
      name !== 'Mutation' &&
      !/^__/.test(name)
    ) {
      console.log(type)
      if (type.astNode) {
        if (Array.isArray(type.astNode.directives)) {
          const stateDirective = find(type.astNode.directives, d => d.name.value === 'state')
          if (stateDirective) {
            if (!state[name]) {
              state[name] = {}
            }
            const fields = type.getFields()
            for (const fieldName in fields) {
              const field = fields[fieldName]
              state[name][fieldName] = {
                field,
                value: 'a string'
              }
            }
          }
        }
      }
    }
  }
  console.log(state)
  return {
    schema: gql`
    directive @state on OBJECT
    scalar Any

    extend type Query {
      getState(state: String): Any
      getStateName: String
    }
    `,
    resolvers: {
      getState: (state: string) => {
        return 'hello'
      }
    }
  }
}