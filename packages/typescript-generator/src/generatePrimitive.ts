export default function generatePrimitive(type: string) {
  if (type === 'ID' || type === 'String') {
    return 'string'
  }
  if (type === 'Int' || type === 'Float') {
    return 'number'
  }
  if (type === 'Boolean') {
    return 'boolean'
  }
}