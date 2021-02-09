import { parse } from 'graphql'
import { getFields, getKind, getName, getTypes } from '@browserql/fpql'
import colors from 'colors'

export default function highlight(code: string) {
  const schema = parse(code)
  const types = getTypes(schema)
  const defs = [...types]
  defs.forEach((def) => {
    if (def.kind === 'ObjectTypeDefinition') {
      const fields = getFields(def)
      console.log(
        colors.magenta('type'),
        colors.yellow(getName(def)),
        fields.length ? colors.bold('{') : ''
      )
      if (fields.length) {
        fields.forEach((field) => {
          console.log(
            '  ',
            getName(field).concat(colors.grey(':')),
            getKind(field)
          )
        })
        console.log(colors.bold('}'))
      }
    }
    console.log()
  })
}
