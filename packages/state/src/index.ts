import { GraphQLSchema, isObjectType, GraphQLField, isScalarType, isNonNullType, GraphQLOutputType, GraphQLArgument } from 'graphql'
import gql from 'graphql-tag'
import { find, camelCase, upperFirst } from 'lodash'
import printType from 'browserql-utils/src/printType'

interface State {
  [type: string]: {
    [field: string]: {
      field: GraphQLField<any, any>,
      value: any
    }
  }
}

function setNonNullInitialValue(type: GraphQLOutputType) {
  if (isNonNullType(type)) {
    return setNonNullInitialValue(type.ofType)
  }
  if (isScalarType(type)) {
    switch (type.name) {
      case 'String': return ''
      case 'Int': return 0
      case 'Float': return 0
      case 'Boolean': return true
    }
  }
}

function setInitialValue(type: GraphQLOutputType) {
  if (isNonNullType(type)) {
    return setNonNullInitialValue(type.ofType)
  }
  return null
}

function setDefaultValue(field: GraphQLField<any, any>, fallback: any) {
  const { astNode } = field
  if (astNode) {
    if (astNode.directives) {
      const defaultDirective = find(astNode.directives, directive => directive.name.value === 'default')
      if (defaultDirective) {
        return defaultDirective.arguments[0].value.value
      }
    }
  }
  return fallback
}


export default function browserqlPluginState(
  schema: GraphQLSchema) {
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
                value: setDefaultValue(field, setInitialValue(field.type))
              }
            }
          }
        }
      }
    }
  }
  console.log({state})
  const stateResolvers: any = {}
  const queries: string[] = []
  const mutations: string[] = []
  for (const type in state) {
    for (const field in state[type]) {
      const name = upperFirst(camelCase(`${ type } ${ field }`))
      const queryName = `get${ name }`
      const mutationName = `set${ name }`
      const kind = printType(state[type][field].field.type)
      queries.push(`${ queryName }: ${ kind }`)
      stateResolvers[queryName] = () => state[type][field].value
      stateResolvers[mutationName] = () => state[type][field].value
      mutations.push(`${ mutationName }(value: ${ kind }): ${ kind }`)
    }
  }
  const source = `
  directive @state on OBJECT
  scalar Any

  extend type Query {
    ${ queries.join('\n  ') }
  }

  extend type Mutation {
    ${ mutations.join('\n  ') }
  }
  `
  return {
    schema: gql(source),
    resolvers: stateResolvers,
    context: { state },
    rehydrateWithClient: ({client, resolvers, transaction}) => {
      for (const type in state) {
        for (const field in state[type]) {
          const name = upperFirst(camelCase(`${ type } ${ field }`))
          const queryName = `get${ name }`
          const mutationName = `set${ name }`
          resolvers[queryName] = () => {
            const q = transaction(queryName)
            console.log(q.source)
            try {
              const result = client.readQuery({
                query: q.node
              })
              console.log({result})
            } catch (error) {
              client.writeQuery({
                query: q.node,
                data: {
                  [queryName]: state[type][field].value
                }
              })
            }
            return state[type][field].value
          }
          resolvers[mutationName] = ({ value }) => {
            const q = transaction(queryName)
            console.log(q.source)
            client.writeQuery({
              query: q.node,
              data: {
                [queryName]: value
              }
            })
            return value
          }
        }
      }
    }
  }
}