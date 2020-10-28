import type { DocumentNode, FieldDefinitionNode } from 'graphql'
import getExtendedQueries from './getExtendedQueries'
import getRootQuery from './getRootQuery'
import toDocument from './toDocument'

export interface Options {
  includeExtended?: boolean
  extendedOnly?: boolean
}

export default function getQueries(
  doc: string | DocumentNode,
  options: Options = {}
): FieldDefinitionNode[] {
  const document = toDocument(doc)
  const queries: FieldDefinitionNode[] = []
  if (options.extendedOnly !== true) {
    const queryType = getRootQuery(document)
    if (queryType) {
      // @ts-ignore
      queries.push(...queryType.fields)
    }
  }
  if (options.includeExtended !== false) {
    const extendedQueries = getExtendedQueries(document)
    extendedQueries.forEach((q) => {
      // @ts-ignore
      queries.push(...q.fields)
    })
  }
  return queries
}
