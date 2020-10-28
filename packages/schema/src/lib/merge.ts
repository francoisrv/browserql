import { DocumentNode, print } from 'graphql';
import gql from 'graphql-tag';
import { getName } from '..';
import toDocument from './toDocument';

type Mergeable =
| string
| DocumentNode

export default function merge(...args: Mergeable[]) {
  const types: string[] = []
  const documents = args
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
    .map(document => print(document))
  const source = documents.join('\n')
  // console.log(source)
  const document = gql(source)
  return document
}