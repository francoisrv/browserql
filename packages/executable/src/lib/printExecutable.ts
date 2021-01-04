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
import {
  DocumentNode,
  FieldDefinitionNode,
  InputValueDefinitionNode,
} from 'graphql'
import printArguments from './printArguments'
import printSelections from './printSelections'

export type ExecutableArg = DocumentNode | string

/**
 * Print agnostic operation
 * @param schema GraphQL definitions
 * @param path The path to the field, using dot notation, ie `Type.field`
 */
export default function printExecutable(...params: ExecutableArg[]): string {
  const schemas: DocumentNode[] = []
  const operations: {
    type: string
    field: string
    node: FieldDefinitionNode
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
          node: query,
          variables: [...args].reduce(
            (vars, arg) => ({
              ...vars,
              [getName(arg)]: getKind(arg as InputValueDefinitionNode),
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
          node: mutation,
          variables: [...args].reduce(
            (vars, arg) => ({
              ...vars,
              [getName(arg)]: getKind(arg as InputValueDefinitionNode),
            }),
            {} as Record<string, string>
          ),
        })
      } else {
        const type = getType(typeName)(schema)
        if (!type) {
          throw new Error(`No such type: ${typeName}`)
        }
        const field = getField(fieldName)(type) as FieldDefinitionNode
        if (!field) {
          throw new Error(`No such field: ${typeName}.${fieldName}`)
        }
        const args = getArguments(field as FieldDefinitionNode)
        operations.push({
          type: typeName,
          field: fieldName,
          node: field,
          variables: [...args].reduce(
            (vars, arg) => ({
              ...vars,
              [getName(arg)]: getKind(arg as InputValueDefinitionNode),
            }),
            {} as Record<string, string>
          ),
        })
      }
    }
  })

  const variables: Record<string, string> = {}

  operations.forEach((operation) => {
    for (const variable in operation.variables) {
      if (variable in variables) {
        if (variables[variable] !== operation.variables[variable]) {
          throw new Error(
            `Field ${operation.type}.${operation.field}'s kind is not matching ${variables[variable]}`
          )
        }
      } else {
        variables[variable] = operation.variables[variable]
      }
    }
  })

  const entry = Object.keys(variables).length
    ? `(\n${printArguments(variables, 2, { variant: 'define' })}\n)`
    : ''

  return `${entry} {
${operations
  .map((operation) => {
    let string = `  ${operation.field}`
    if (Object.keys(operation.variables).length) {
      string += `(\n${printArguments(operation.variables, 4, {
        variant: 'assign',
      })}\n  )`
    }
    string += printSelections(operation.node, schema)
    return string
  })
  .join('\n\n')}
}`
}
