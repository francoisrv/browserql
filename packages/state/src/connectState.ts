import enhanceSchema, { getKind, getName, hasDirective, parseKind } from '@browserql/schema'
import type { Schemaql, SchemaqlFactory, BrowserqlContext } from '@browserql/types'
import gql from 'graphql-tag'
import type { DocumentNode } from 'graphql'
import { get, increment, set } from './lib'

export interface ConnectStateOptions {
  schema?: DocumentNode
}

export default function connectState(options: ConnectStateOptions = {}): SchemaqlFactory {
  return browserqlClient => {
    const queries: Schemaql['queries'] = {}
    const mutations: Schemaql['mutations'] = {}
    const ourSchema = enhanceSchema(gql`
      directive @state on OBJECT
    `)
    const theirSchema = enhanceSchema(browserqlClient.schema as DocumentNode)
    if (options.schema) {
      theirSchema.extend(options.schema)
    }
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
          increment: `state_${typeName}_${fieldName}_increment`,
        }
        
        ourSchema.extend(gql`
          extend type Query {
            ${names.get}: ${kind}
          }

          extend type Mutation {
            ${names.set}(next: ${kind}): Boolean !
          }
        `)
        
        if (parsedKind.type === 'Int') {
          ourSchema.extend(gql`
          extend type Mutation {
            ${names.increment}(step: Int): Boolean !
          }
        `)
        }
        
        queries[names.get] = (
          _variables: any,
          context: BrowserqlContext,
        ) => get(
          context.browserqlClient,
          typeName,
          field,
        )
        
        mutations[names.set] = (
          data: { next: any },
          context: BrowserqlContext,
        ) => set(
          context.browserqlClient,
          typeName,
          fieldName,
          data.next,
        )
        
        if (parsedKind.type === 'Int') {
          mutations[names.increment] = (
            data: { step?: number },
            context: BrowserqlContext,
          ) => increment(
            context.browserqlClient,
            typeName,
            field,
            data.step,
          )
        }
      })
    })
    return {
      schema: ourSchema.get(),
      queries,
      mutations,
    }
  }
}
