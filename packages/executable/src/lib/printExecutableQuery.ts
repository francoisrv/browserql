import { getQuery } from '@browserql/fpql'
import { DocumentNode } from 'graphql'
import printExecutable, { ExecutableArg } from './printExecutable'

/**
 *
 * @param schema
 * @param queryName
 */
export default function printExecutableQuery(...args: ExecutableArg[]): string {
  return `query Query${printExecutable(
    ...args.map((arg) => {
      if (typeof arg === 'string') {
        return `Query.${arg}`
      }
      return arg
    })
  )}`
}
