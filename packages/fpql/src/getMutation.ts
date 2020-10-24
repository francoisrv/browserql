import { DocumentNode } from 'graphql'
import getMutations from './getMutations'
import getName from './getName'

export default function getMutation(name: string) {
  return (document: DocumentNode) => getMutations(document)
    .find(mutation => getName(mutation) === name)
}