type DefKind = 'type'

export default function parseInput(
  defKind?: DefKind,
  path?: string,
  kind?: string
) {
  let definition = defKind
  let [typeName, fieldName, argName] = (path || '').split(/\./)
  let newTypeName, newFieldName, newArgName
  let nextKind
  let directiveName

  if (/:/.test(typeName)) {
    ;[typeName, newTypeName] = typeName.split(':')
  }

  if (/:/.test(fieldName)) {
    ;[fieldName, newFieldName] = fieldName.split(':')
  }

  if (/:/.test(argName)) {
    ;[argName, newArgName] = argName.split(':')
  }

  if (kind) {
    if (/^@/.test(kind)) {
      directiveName = kind.replace(/^@/, '')
    } else {
      nextKind = kind
    }
  }

  return {
    definition,
    typeName: typeName || undefined,
    fieldName: fieldName || undefined,
    argName: argName || undefined,
    kind: nextKind,
    newTypeName,
    newFieldName,
    newArgName,
    directiveName,
  }
}
