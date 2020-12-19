import { DocumentNode, print } from 'graphql'
import gql from 'graphql-tag'
import getName from './getName'

/**
 * Merge different document nodes together
 * @param {DocumentNode[]} documents The documents to merge
 */
export default function merge(...documents: DocumentNode[]): DocumentNode {
  const types: string[] = []

  const nextDocuments = documents.map((document) => ({
    ...document,
    definitions: document.definitions.map((definition) => {
      const name = getName(definition)

      switch (definition.kind) {
        case 'ObjectTypeDefinition':
          {
            if (types.indexOf(name) > -1) {
              return {
                ...definition,
                kind: 'ObjectTypeExtension',
              }
            }
          }
          break
        case 'ObjectTypeExtension':
          {
            if (types.indexOf(name) === -1) {
              return {
                ...definition,
                kind: 'ObjectTypeDefinition',
              }
            }
          }
          break
      }

      if (
        definition.kind === 'ObjectTypeExtension' ||
        definition.kind === 'ObjectTypeDefinition'
      ) {
        if (types.indexOf(name) === -1) {
          types.push(name)
        }
      }

      return definition
    }),
  }))

  const source = nextDocuments
    .map((document) => print(document as DocumentNode))
    .join('\n')
  const document = gql(source)
  return document
}
