import { print, DefinitionNode, DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import { findIndex } from 'lodash'
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
  const Queries = document.definitions.filter((def) => getName(def) === 'Query')
  const RootQueries = Queries.filter(
    (def) => def.kind === 'ObjectTypeDefinition'
  )
  if (Queries.length && !RootQueries.length) {
    const candidate = findIndex(
      document.definitions,
      (def) => getName(def) === 'Query'
    )
    // @ts-ignore
    document.definitions[candidate].kind = 'ObjectTypeDefinition'
  }
  const nextDefinitions: DefinitionNode[] = []
  document.definitions.forEach(def => {
    const name = getName(def)
    const exists = nextDefinitions.find(def => getName(def) === name)
    if (exists) {
      if (def.kind === 'ObjectTypeDefinition') {
        nextDefinitions.push({
          ...def,
          kind: 'ObjectTypeExtension'
        })
      }
    } else {
      nextDefinitions.push(def)
    }
  })
  // @ts-ignore
  // document.definitions = nextDefinitions
}
