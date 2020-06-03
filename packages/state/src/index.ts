import { GraphQLSchema } from 'graphql'
import buildState from './buildState'
import buildSchema from './buildSchema'
import buildResolvers from './buildResolvers'



// function setNonNullInitialValue(type: GraphQLOutputType) {
//   if (isNonNullType(type)) {
//     return setNonNullInitialValue(type.ofType)
//   }
//   if (isScalarType(type)) {
//     switch (type.name) {
//       case 'String': return ''
//       case 'Int': return 0
//       case 'Float': return 0
//       case 'Boolean': return true
//     }
//   }
// }

// function setInitialValue(type: GraphQLOutputType) {
//   if (isNonNullType(type)) {
//     return setNonNullInitialValue(type.ofType)
//   }
//   return null
// }

// function setDefaultValue(field: GraphQLField<any, any>, fallback: any) {
//   const { astNode } = field
//   if (astNode) {
//     if (astNode.directives) {
//       const defaultDirective = find(astNode.directives, directive => directive.name.value === 'default')
//       if (defaultDirective) {
//         return defaultDirective.arguments[0].value.value
//       }
//     }
//   }
//   return fallback
// }

const DIRECTIVE_NAME = 'state'

export default function browserqlStatePlugin() {
  return function (schema: GraphQLSchema) {
    const directiveName = DIRECTIVE_NAME
    const state = buildState(schema, directiveName)
    const pluginSchema = buildSchema(state)
    const pluginResolvers = buildResolvers(state)
    return {
      schema: pluginSchema,
      resolvers: pluginResolvers,
      context: { state }
    }
  }
}
