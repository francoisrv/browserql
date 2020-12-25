import { TSGeneratorOptions } from './types'

export default function generatePrimitive(
  type: string,
  options: TSGeneratorOptions = {}
) {
  if (type === 'String') {
    return 'string'
  }
  if (type === 'Int' || type === 'Float') {
    return 'number'
  }
  if (type === 'Boolean') {
    return 'boolean'
  }
  if (type === 'ID') {
    return options.ID || 'string | number'
  }
}
