import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'
import printExecutable, { ExecutableArg } from './printExecutable'

export default function makeExecutable(...args: ExecutableArg[]): DocumentNode {
  return gql(printExecutable(...args))
}
