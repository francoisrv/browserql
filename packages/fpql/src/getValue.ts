import { ArgumentNode } from 'graphql'
import { getName } from '.'

function printValue(value: ArgumentNode['value']): any {
  switch (value.kind) {
    case 'IntValue':
    case 'FloatValue':
      return Number(value.value)
    case 'StringValue':
      return value.value.toString()
    case 'BooleanValue':
      return value.value
    case 'ListValue':
      return value.values.map(printValue)
    case 'ObjectValue':
      return value.fields.reduce(
        (object, field) => ({
          ...object,
          [getName(field)]: printValue(field.value),
        }),
        {}
      )
    default:
      return null
  }
}

export default function getValue(arg: ArgumentNode): any {
  return printValue(arg.value)
}
