import { TSGeneratorOptions } from './types'

export default function generateTSDeclaration(
  name: string,
  type: 'interface',
  options: TSGeneratorOptions
) {
  return `${options.useExport ? 'export ' : ''}${
    options.useDeclare ? 'declare ' : ''
  }${type} ${name}${options.typeSuffix || ''}`
}
