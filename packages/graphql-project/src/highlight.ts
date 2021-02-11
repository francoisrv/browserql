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
import logBlock from './logBlock'

function highlightCode(kind: string) {
  const parsed = parseKind(kind)
  if (parsed.required) {
    return colors.bold
  }
  return colors.hidden
}

export default function highlight(code: string) {
  const schema = parse(code)
  let i = 1
  const displayLineNumber = () => {
    const lineNumber = i++
    let repeat = 0
    if (lineNumber < 10) {
      repeat = 2
    } else if (lineNumber < 100) {
      repeat = 1
    }
    return colors.bgBlue
      .white(' '.repeat(repeat).concat(lineNumber.toString()))
      .concat(' '.repeat(2))
  }
  schema.definitions.forEach((def) => {
    switch (def.kind) {
      case 'ObjectTypeDefinition':
        {
          const fields = getFields(def)
          const directives = getDirectives(def)
          const parsed = directives.map((directive) => `@${getName(directive)}`)
          logBlock(
            displayLineNumber(),
            colors.green('type'),
            colors.yellow.bold(getName(def)),
            directives.length && parsed.join(' ').length < 80
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
                displayLineNumber(),
                '  ',
                parsed.required
                  ? colors.bold(getName(field).concat(colors.bold(':')))
                  : getName(field).concat(colors.bold(':')),
                colors.yellow(getKind(field))
              )
            })
            console.log(displayLineNumber(), colors.bold('}'))
          }
        }
        break

      case 'DirectiveDefinition':
        {
          logBlock(
            displayLineNumber(),
            colors.green('directive'),
            colors.yellow(`@${colors.bold(getName(def))}`),
            'on',
            def.locations.map((loc) => loc.value).join(' | ')
          )
        }
        break
    }
    console.log(displayLineNumber())
  })
}
