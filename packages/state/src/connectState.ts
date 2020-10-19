import enhanceSchema, { getKind, getName, hasDirective, parseKind } from '@browserql/schema'
import { Schemaql, SchemaqlFactory } from '@browserql/types'
import gql from 'graphql-tag'
import type { DocumentNode } from 'graphql'

export default function connectState(): SchemaqlFactory {
  return ({ schema }) => {
    const queries: Schemaql['queries'] = {}
    const ourSchema = enhanceSchema(gql`
      directive @state on OBJECT
    `)
    const theirSchema = enhanceSchema(schema as DocumentNode)
    const types = theirSchema.getTypes()
    const typesWithState = types.filter(type => hasDirective(type, 'state'))
    typesWithState.forEach(type => {
      const typeName = getName(type)
      const { fields = [] } = type
      fields.forEach(field => {
        const fieldName = getName(field)
        const kind = getKind(field)
        const parsedKind = parseKind(kind)
        const names = {
          get: `state_${typeName}_${fieldName}_get`,
          set: `state_${typeName}_${fieldName}_set`,
        }
        ourSchema.extend(gql`
          extend type Query {
            ${names.get}: ${kind}
            ${names.set}(next: ${kind}): Boolean !
          }
        `)
      })
    })
    return {
      schema: ourSchema.get(),
      queries,
    }
  }
}