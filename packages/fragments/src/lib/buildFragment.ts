import {
  getFields,
  getKind,
  getName,
  getType,
  parseKind,
} from '@browserql/fpql'
import type { DocumentNode, FieldDefinitionNode } from 'graphql'
import get from 'lodash.get'
import set from 'lodash.set'

interface Options {
  saveAs?: string
  select?: string[]
}

interface Selection {
  [name: string]: 1 | Selection
}

function makeSelections(
  schema: DocumentNode,
  fields: readonly FieldDefinitionNode[]
): Selection {
  return fields.reduce(
    (selections, field) => {
      const { type: fieldKind } = parseKind(getKind(field))
      const fieldType = getType(fieldKind)(schema)

      if (fieldType) {
        return {
          ...selections,
          [getName(field)]: makeSelections(
            schema,
            getFields(fieldType) as readonly FieldDefinitionNode[]
          ),
        }
      }

      return {
        ...selections,
        [getName(field)]: 1,
      }
    },
    {
      __typename: 1,
    }
  )
}

function printSelections(selections: Selection, tab = 0): string {
  return Object.keys(selections)
    .map((field) => {
      if (selections[field] === 1) {
        return field
      }
      return `${field} {\n${'  '.repeat(tab + 2)}${printSelections(
        selections[field] as Selection,
        tab + 1
      )}\n${'  '.repeat(tab + 1)}}`
    })
    .join('\n'.concat('  '.repeat(tab + 1)))
}

function addTypeNames(selection: Selection): Selection {
  return Object.keys(selection).reduce((set, key) => {
    if (selection[key] === 1) {
      return { ...set, [key]: 1 }
    }
    return {
      ...set,
      [key]: {
        ...addTypeNames(selection[key] as Selection),
        __typename: 1,
      },
    }
  }, {})
}

export default function buildFragment(
  schema: DocumentNode,
  typeName: string,
  options: Options = {}
) {
  const type = getType(typeName)(schema)
  if (!type) {
    throw new Error('Can not build fragment from unknow type '.concat(typeName))
  }
  let selections = makeSelections(
    schema,
    getFields(type) as readonly FieldDefinitionNode[]
  )
  if (options.select) {
    const nextSelections = {}
    options.select.forEach((path) => {
      set(nextSelections, path, get(selections, path))
    })
    selections = nextSelections
  }
  selections = addTypeNames(selections)
  selections.__typename = 1
  const source = `
fragment ${options.saveAs || `${getName(type)}Fragment`} on ${getName(type)} {
  ${printSelections(selections)}
}
  `
  return source
}
