import { ArgumentNode } from 'graphql'

function printValue(value: ArgumentNode['value']): any {
  switch (value.kind) {
    case 'IntValue':
    case 'FloatValue':
      return Number(value.value)
    case 'StringValue':
      return value.value
    case 'BooleanValue':
      return value.value
    case 'ListValue':
      return value.values.map(printValue)
    default:
      return null
  }
}

export default function getValue(arg: ArgumentNode): any {
  console.log(arg.value.kind)
  return printValue(arg.value)
}
