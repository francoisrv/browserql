import {
  getArgument,
  getDirective,
  getKind,
  getName,
  getValue,
  parseKind,
} from '@browserql/fpql'
import { FieldDefinitionNode, InputValueDefinitionNode } from 'graphql'

export default function applyDefaults(
  fields: Readonly<Array<FieldDefinitionNode | InputValueDefinitionNode>>,
  defaultFunctions: Record<string, () => any>
) {
  return fields.reduce((defaults, field) => {
    const fieldName = getName(field)
    const defaultDirective = getDirective('default')(
      field as FieldDefinitionNode
    )
    const { required } = parseKind(getKind(field))

    if (defaultDirective) {
      const argValue = getArgument('value')(defaultDirective)
      const argFn = getArgument('function')(defaultDirective)

      if (argValue) {
        const value = getValue(argValue)
        return {
          ...defaults,
          [fieldName]: value,
        }
      }

      if (argFn) {
        const fn = getValue(argFn)
        const defaultFunction = defaultFunctions[fn]
        if (!defaultFunction) {
          throw new Error(`No such default function: ${fn}`)
        }
        return {
          ...defaults,
          [fieldName]: defaultFunction(),
        }
      }
    }

    if (!required) {
      return {
        ...defaults,
        [fieldName]: null,
      }
    }

    return defaults
  }, {})
}
