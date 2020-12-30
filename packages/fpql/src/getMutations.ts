import type { DocumentNode, FieldDefinitionNode } from 'graphql'
import getExtendedMutations from './getExtendedMutations'
import getRootMutation from './getRootMutation'

export interface Options {
  includeExtended?: boolean
  extendedOnly?: boolean
}

export default function getMutations(
  document: DocumentNode,
  options: Options = {}
): FieldDefinitionNode[] {
  const mutations: FieldDefinitionNode[] = []
  if (options.extendedOnly !== true) {
    const rootMutation = getRootMutation(document)
    if (rootMutation) {
      // @ts-ignore
      mutations.push(...rootMutation.fields)
    }
  }
  if (options.includeExtended !== false) {
    const extendedMutations = getExtendedMutations(document)
    extendedMutations.forEach((q) => {
      // @ts-ignore
      mutations.push(...q.fields)
    })
  }
  return mutations
}
