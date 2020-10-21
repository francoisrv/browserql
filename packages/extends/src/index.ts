import gql from 'graphql-tag'
import enhanceSchema, { getKind, getName, hasDirective } from '@browserql/schema'

import type { SchemaqlFactory } from '@browserql/types'
import type { DocumentNode, StringValueNode, ObjectTypeDefinitionNode } from 'graphql'

interface Options {
  schema?: DocumentNode
}

function extendFields(type: ObjectTypeDefinitionNode) {
  const { fields = [] } = type
  const lines: string[] = fields.map(
    field => getName(field).concat(': ').concat(getKind(field))
  )
  return lines.join('\n')
}

export default function connectExtends(options: Options = {}): SchemaqlFactory {
  return ({ schema }) => {
    const ourSchema = enhanceSchema(gql`
      directive @extends(type: String!) on OBJECT
    `)
    let theirSchema
    if (schema) {
      theirSchema = enhanceSchema(schema)
      if (options.schema) {
        theirSchema.extend(options.schema)
      }
    } else if (options.schema) {
      theirSchema = enhanceSchema(options.schema)
    } else {
      throw new Error('Missing their schema')
    }
    const types = theirSchema.getTypes()
    const directiveTypes = types.filter(type => hasDirective(type, 'extends'))
    for (const type of directiveTypes) {
      const { directives = [] } = type
      const ourDirective = directives.find(directive => getName(directive) === 'extends')
      if (ourDirective) {
        const { arguments: args = [] } = ourDirective
        const arg = args.find(arg => getName(arg) === 'type')
        if (arg) {
          const { value } = arg.value as StringValueNode
          const extendType = theirSchema.getType(value)
          if (extendType) {
            ourSchema.extend(gql`
              extend type ${getName(type)} {
                ${extendFields(extendType)}
              }
            `)
          }
        }
      }
    }
    return {
      schema: ourSchema.get(),
    }
  }
}
