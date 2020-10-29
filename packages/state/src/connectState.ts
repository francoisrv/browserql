import type {
  Schemaql,
  SchemaqlFactory,
  BrowserqlContext,
} from '@browserql/types'
import gql from 'graphql-tag'
import type { DocumentNode } from 'graphql'
import {
  getDirective,
  getKind,
  getName,
  getType,
  getTypes,
  merge,
  parseKind,
  printParsedKind,
} from '@browserql/fpql'
import { transformTypeToInput } from '@browserql/input'

import { get, increment, set } from './lib'

export interface ConnectStateOptions {
  schema?: DocumentNode
}

export default function connectState(
  options: ConnectStateOptions = {}
): SchemaqlFactory {
  return (browserqlClient) => {
    const queries: Schemaql['queries'] = {}
    const mutations: Schemaql['mutations'] = {}
    const ourSchema: DocumentNode[] = [
      gql`
        directive @state on OBJECT
      `,
    ]
    const inputs: DocumentNode[] = []

    const theirSchema = merge(browserqlClient.schema, options.schema)
    const types = getTypes(theirSchema)

    const typesWithState = types.filter(getDirective('state'))
    typesWithState.forEach((type) => {
      const typeName = getName(type)
      const { fields = [] } = type

      fields.forEach((field) => {
        const fieldName = getName(field)
        const kind = getKind(field)
        const parsedKind = parseKind(kind)
        const kindType = getType(parsedKind.type)(theirSchema)

        if (kindType) {
          inputs.push(transformTypeToInput(kindType, theirSchema))
        }

        const names = {
          get: `state_${typeName}_${fieldName}_get`,
          set: `state_${typeName}_${fieldName}_set`,
          increment: `state_${typeName}_${fieldName}_increment`,
        }

        ourSchema.push(gql`
          extend type Query {
            """
            Get state of ${typeName}.${fieldName}
            """
            ${names.get}: ${kind}
          }

          extend type Mutation {
            """
            Set state of ${typeName}.${fieldName}
            """
            ${names.set}(next: ${
          kindType
            ? printParsedKind({
                ...parsedKind,
                type: `${parsedKind.type}Input`,
              })
            : kind
        }): Boolean !
          }
        `)

        if (parsedKind.type === 'Int') {
          ourSchema.push(gql`
          extend type Mutation {
            ${names.increment}(step: Int): Boolean !
          }
        `)
        }

        queries[names.get] = (_variables: any, context: BrowserqlContext) =>
          get(context.browserqlClient, typeName, field)

        mutations[names.set] = (
          data: { next: any },
          context: BrowserqlContext
        ) => set(context.browserqlClient, typeName, fieldName, data.next)

        if (parsedKind.type === 'Int') {
          mutations[names.increment] = (
            data: { step?: number },
            context: BrowserqlContext
          ) => increment(context.browserqlClient, typeName, field, data.step)
        }
      })
    })
    return {
      schema: merge(...ourSchema, ...inputs),
      queries,
      mutations,
    }
  }
}
