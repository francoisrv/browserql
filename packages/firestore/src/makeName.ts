import { Dictionary } from '@browserql/types'
import * as queries from './queries'

const patterns = ['firestore']
const glue = '_'

export default function makeName(...names: string[]) {
  return [...patterns, ...names].join(glue)
}

export function makeNames(collection: string) {
  const names: Dictionary<string> = {}
  for (const query in queries) {
    if (typeof queries[query as keyof typeof queries]) {
      names[query] = makeName(query, collection)
    }
  }
  return names
}
