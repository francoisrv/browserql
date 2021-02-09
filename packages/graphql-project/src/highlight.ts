import { parse } from 'graphql'
import {
  getDirectives,
  getFields,
  getKind,
  getName,
  getTypes,
  parseKind,
} from '@browserql/fpql'
import colors from 'colors'

function highlightCode(kind: string) {
  const parsed = parseKind(kind)
  if (parsed.required) {
    return colors.bold
  }
  return colors.hidden
}

export default function highlight(code: string) {
  const schema = parse(code)
  const types = getTypes(schema)
  const defs = [...types]
  defs.forEach((def) => {
    if (def.kind === 'ObjectTypeDefinition') {
      const fields = getFields(def)
      const directives = getDirectives(def)
      const parsed = directives.map((directive) => `@${getName(directive)}`)
      console.log(
        colors.green('type'),
        colors.yellow(getName(def)),
        parsed.join(' ').length < 80
          ? parsed.join(' ').concat(fields.length ? colors.bold(' {') : '')
          : '',
        fields.length && !directives.length ? colors.bold('{') : ''
      )
      if (directives.length && parsed.join(' ').length >= 80) {
        directives.forEach((directive) => {
          console.log(' ', `@${getName(directive)}`)
        })
        if (fields.length) {
          console.log(colors.bold('{'))
        }
      }
      if (fields.length) {
        fields.forEach((field) => {
          const parsed = parseKind(getKind(field))
          console.log(
            '  ',
            parsed.required
              ? colors.bold(getName(field).concat(colors.bold(':')))
              : getName(field).concat(colors.bold(':')),
            colors.yellow(getKind(field))
          )
        })
        console.log(colors.bold('}'))
      }
    }
    console.log()
  })
}
