import { DocumentNode, FieldDefinitionNode } from 'graphql'
import getExtendedMutations from './getExtendedMutations'
import getRootMutation from './getRootMutation'
import toDocument from './toDocument'

export interface Options {
  includeExtended?: boolean
  extendedOnly?: boolean
}

export default function getMutations(
  doc: DocumentNode | string,
  options: Options = {}
): FieldDefinitionNode[] {
  const document = toDocument(doc)
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
