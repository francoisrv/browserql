import { DocumentNode } from 'graphql'
import getQueries from './getQueries'
import getName from './getName'

export default function getQuery(name: string) {
  return (document: DocumentNode) => getQueries(document)
    .find(query => getName(query) === name)
}