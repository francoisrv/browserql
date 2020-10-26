import type { DocumentNode } from 'graphql'
import { getMutations, getQueries, getTypes } from '@browserql/fpql'

import { TSGeneratorOptions } from './types'
import generateType from './generateType'
import generateTSDeclaration from './generateTSDeclaration'
import generateField from './generateField'

export default function generatets(
  schema: DocumentNode,
  options: TSGeneratorOptions = {}
) {
  const types = getTypes(schema)
    .map((type) => generateType(type, schema, options))
    .join('\n')
  const queries = getQueries(schema)
  const mutations = getMutations(schema)
  return [
    types,
    queries.length > 0 &&
      `
${generateTSDeclaration('Query', 'interface', options)} {
${queries.map(generateField(schema, options)).join('\n')}
}
`,
    mutations.length > 0 &&
      `
${generateTSDeclaration('Mutation', 'interface', options)} {
${mutations.map(generateField(schema, options)).join('\n')}
}
`,
  ]
    .filter(Boolean)
    .join('\n')
}
