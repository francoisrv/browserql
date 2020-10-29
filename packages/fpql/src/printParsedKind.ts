import type { ParsedType } from './parseKind'

export default function printParsedKind(parsed: ParsedType) {
  if (!parsed.required && !parsed.depth) {
    return parsed.type
  }
  if (parsed.required && !parsed.depth) {
    return parsed.type.concat('!')
  }
  const bits: string[] = []
  const nested: number[] = []
  for (let i = 0; i < parsed.depth; i++) {
    nested.push(i)
  }
  bits.push(...nested.map(() => '['))
  bits.push(parsed.type)
  bits.push(...nested.map((i) => `${parsed.nestedRequired[i] ? '!' : ''}]`))

  if (parsed.required) {
    bits.push('!')
  }

  return bits.join('')
}
