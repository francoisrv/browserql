import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import { getName } from '..'

export default function extend(
  document: DocumentNode,
  schema: string | DocumentNode
) {
  const extending = typeof schema === 'string' ? gql(schema) : schema
  // @ts-ignore
  document.definitions.push(
    ...extending.definitions.map((def) => {
      if (
        def.kind === 'ObjectTypeDefinition' &&
        (getName(def) === 'Query' || getName(def) === 'Mutation')
      ) {
        // @ts-ignore
        def.kind = 'ObjectTypeExtension'
      }
      return def
    })
  )
}
