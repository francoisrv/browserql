import { DocumentNode, FieldDefinitionNode } from 'graphql'
import getExtendedQueries from './getExtendedQueries'
import getRootQuery from './getRootQuery'

export interface Options {
  includeExtended?: boolean
  extendedOnly?: boolean
}

export default function getQueries(
  document: DocumentNode,
  options: Options = {}
): FieldDefinitionNode[] {
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
