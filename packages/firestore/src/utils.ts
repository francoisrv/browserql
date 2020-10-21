import { getName } from '@browserql/schema'
import { DirectiveNode, ObjectTypeDefinitionNode, StringValueNode } from 'graphql'
import { camelCase } from 'lodash'
import { Query, QueryOperator } from './types'

export function where(field: string) {
  return {
    equals(value: any): Query {
      return {
        field,
        value,
        operator: QueryOperator.equals,
      }
    },

    references(collection: string): Query {
      return {
        field,
        value: collection,
        operator: QueryOperator.references,
      }
    }
  }
}

export function plural(name: string) {
  return /y$/.test(name) ? name.replace(/y$/, 'ies') : ''.concat(name).concat('s')
}

export function convertName(name: string) {
  return plural(camelCase(name)).toLowerCase()
}

export function getCollectionName(type: ObjectTypeDefinitionNode) {
  const name = getName(type)
  const { directives = [] } = type
  const directive = directives.find(directive => getName(directive) === 'firestore') as DirectiveNode
  const { arguments: args = [] } = directive
  const collectionArg = args.find(arg => getName(arg) === 'collection')
  return collectionArg ? (collectionArg.value as StringValueNode).value : convertName(name)
}
