import {
  getArguments,
  getField,
  getKind,
  getMutation,
  getName,
  getQuery,
  getType,
  merge,
} from '@browserql/fpql'
import { ArgumentNode, DocumentNode, FieldDefinitionNode } from 'graphql'
import buildArguments from './buildArguments'
import printArguments from './printArguments'
import printSelections from './printSelections'

type ExecutableArg = DocumentNode | string

/**
 * Print agnostic operation
 * @param schema GraphQL definitions
 * @param path The path to the field, using dot notation, ie `Type.field`
 */
export default function printExecutable(
  ...params: ExecutableArg[]
): string | undefined {
  const schemas: DocumentNode[] = []
  const operations: {
    type: string
    field: string
    variables: Record<string, string>
  }[] = []

  params.forEach((param) => {
    if (param && typeof param === 'object' && 'definitions' in param) {
      schemas.push(param)
    }
  })

  const schema = merge(...schemas)

  params.forEach((param) => {
    if (typeof param === 'string') {
      if (!/\./.test(param)) {
        throw new Error('Invalid field declaration, was expecting TYPE.FIELD')
      }
      const [typeName, fieldName] = param.split(/\./)
      if (typeName === 'Query') {
        const query = getQuery(fieldName)(schema)
        if (!query) {
          throw new Error(`No such query: ${fieldName}`)
        }
        const args = getArguments(query)
        operations.push({
          type: typeName,
          field: fieldName,
          variables: [...args].reduce(
            (vars, arg) => ({
              ...vars,
              [getName(arg)]: getKind(arg),
            }),
            {} as Record<string, string>
          ),
        })
      } else if (typeName === 'Mutation') {
        const mutation = getMutation(fieldName)(schema)
        if (!mutation) {
          throw new Error(`No such mutation: ${fieldName}`)
        }
        const args = getArguments(mutation)
        operations.push({
          type: typeName,
          field: fieldName,
          variables: [...args].reduce(
            (vars, arg) => ({
              ...vars,
              [getName(arg)]: getKind(arg),
            }),
            {} as Record<string, string>
          ),
        })
      } else {
        const type = getType(typeName)(schema)
        if (!type) {
          throw new Error(`No such type: ${typeName}`)
        }
        const field = getField(fieldName)(type)
        if (!field) {
          throw new Error(`No such field: ${typeName}.${fieldName}`)
        }
        const args = getArguments(field as FieldDefinitionNode)
        operations.push({
          type: typeName,
          field: fieldName,
          variables: [...args].reduce(
            (vars, arg) => ({
              ...vars,
              [getName(arg)]: getKind(arg),
            }),
            {} as Record<string, string>
          ),
        })
      }
    }
  })

  const variables: Record<string, string> = {}

  operations.forEach((operation) => {})

  return 'hello'
  //   const [typeName, fieldName] = path.split(/\./)
  //   let field: FieldDefinitionNode

  //   if (typeName === 'Query') {
  //     field = getQuery(fieldName)(schema) as FieldDefinitionNode
  //   } else if (typeName === 'Mutation') {
  //     field = getMutation(fieldName)(schema) as FieldDefinitionNode
  //   } else {
  //     const type = getType(typeName)(schema)
  //     if (!type) {
  //       console.warn(`Type not found in schema: ${typeName}`)
  //       return undefined
  //     }
  //     field = getField(fieldName)(type) as FieldDefinitionNode
  //   }

  //   if (!field) {
  //     console.warn(`Field not found in schema: ${path}`)
  //     return undefined
  //   }

  //   const selection = printSelections(field, schema)

  //   const args = buildArguments(schema, path)

  //   const hasArgs = Object.keys(args).length > 0

  //   const defs = printArguments(args, 4, { variant: 'define' })
  //   const fvars = printArguments(args, 6, { variant: 'assign' })

  //   const definitions = hasArgs ? `(\n  ${defs}\n)` : ''
  //   const variables = hasArgs ? `(\n  ${fvars}\n)` : ''

  //   return `${definitions}  {
  //   ${fieldName}${variables} ${selection}
  // }`
}
