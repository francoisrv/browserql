export default function buildFragmentBlockWrapper(
  typeName: string,
  block: string
) {
  return `fragment ${typeName}Fragment on ${typeName} {
  ${block}
}`
}
