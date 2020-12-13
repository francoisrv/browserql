import {
  getFields,
  getKind,
  getName,
  getType,
  parseKind,
} from '@browserql/fpql'
import {
  DocumentNode,
  ObjectTypeDefinitionNode,
  ObjectTypeExtensionNode,
} from 'graphql'
import buildFragmentBlockWrapper from './buildFragmentBlockWrapper'

interface Options {
  select?: string[]
}

export default function buildFragmentSelection(
  type: ObjectTypeDefinitionNode | ObjectTypeExtensionNode,
  schema: DocumentNode,
  options: Options = {}
) {
  const fields = getFields(type)
  const typeName = getName(type)
  const fragments: string[] = []
  const selections = fields
    .filter((field) => {
      if (options.select) {
        return options.select.find((a) => {
          return a === getName(field)
        })
      } else {
        return true
      }
    })
    .map((field) => {
      const name = getName(field)
      const { type: fieldKind } = parseKind(getKind(field))
      const fieldType = getType(fieldKind)(schema)
      if (fieldType) {
        fragments.push(buildFragmentSelection(fieldType, schema))
        return `${name} {
    ...${getName(fieldType)}Fragment
  }`
      }
      return name
    })
    .join('\n  ')
    .concat('\n  __typename')
  return buildFragmentBlockWrapper(typeName, selections)
    .concat('\n\n')
    .concat(fragments.join('\n'))
    .trim()
}
