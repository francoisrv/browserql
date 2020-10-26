import { DocumentNode, print } from 'graphql';
import gql from 'graphql-tag';
import getName from './getName';
import toDocument from './toDocument';

type Mergeable =
| string
| DocumentNode
| undefined

export default function merge(...args: Mergeable[]) {
  const types: string[] = []
  const documents = (args as Array<string | DocumentNode>)
    .filter(Boolean)
    .map(toDocument)
    .map(document => ({
      ...document,
      definitions: document.definitions.map(def => {
        if (def.kind === 'ObjectTypeExtension' || def.kind === 'ObjectTypeDefinition') {
          const name = getName(def)
          if (types.indexOf(name) > -1) {
            return {
              ...def,
              kind: 'ObjectTypeExtension'
            }
          } else {
            types.push(name)
          }
        }
        return def
      })
    }))
    .map(document => print(document as DocumentNode))
  const source = documents.join('\n')
  // console.log(source)
  const document = gql(source)
  return document
}