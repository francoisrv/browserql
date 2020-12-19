export default function generatePrimitive(type: string) {
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
    return 'string|number'
  }
}
