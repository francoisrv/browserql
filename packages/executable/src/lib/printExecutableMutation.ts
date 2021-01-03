import { getMutation } from '@browserql/fpql'
import { DocumentNode } from 'graphql'
import printExecutable from './printExecutable'

/**
 *
 * @param schema
 * @param mutationName
 */
export default function printExecutableMutation(
  schema: DocumentNode,
  mutationName: string
): string {
  const mutation = getMutation(mutationName)(schema)
  if (!mutation) {
    throw new Error(`No such mutation: ${mutationName}`)
  }
  return `mutation ${mutationName}${printExecutable(
    schema,
    `Mutation.${mutationName}`
  )}`
}
