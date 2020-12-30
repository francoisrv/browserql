import type { DocumentNode } from 'graphql'
import getName from './getName'

/**
 * Get a definition by name
 * @param {string} name The name of the definition to look for
 * @returns {(document: DocumentNode) => DefinitionNode} A function to be called with a schema
 * @example getByName('User')(gql`type User { id: ID }`) => returns a Type Definition Node
 */
export default function getByName(name: string) {
  return (document: DocumentNode) => {
    const { definitions } = document
    return definitions.find((def) => getName(def) === name)
  }
}
