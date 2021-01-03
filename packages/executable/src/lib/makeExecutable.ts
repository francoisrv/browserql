import { DocumentNode } from 'graphql'

type ExecutableArg =
  | DocumentNode
  | string
  | Record<string, string>
  | [string]
  | [string, Record<string, string>]

export default function makeExecutable(...args: ExecutableArg[]): DocumentNode {
  // const [typeName, fieldName] = path.split(/\./)
  // return gql`
  //   ${typeName.toLowerCase}
  //   ${fieldName}
  //   ${printOperation(schema, path)}
  // `
}
