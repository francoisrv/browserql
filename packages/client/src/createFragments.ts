import Schema from "./Schema";
import { isArray } from "lodash";

export default function createFragments(schema: Schema) {
  const types = schema.types.getTypes()
  for (const type of types) {
    const typeName = Schema.getName(type)
    if (!('fields' in type) || !isArray(type.fields) || !type.fields.length) {
      throw new Error(`No fields found for type ${ typeName }`)
    }
    const fields = type.fields.map(field => {
      let str = Schema.getName(field)
      const fieldKind = Schema.printEndType(field.type)
      const fieldType = schema.types.getType(fieldKind)
      if (fieldType) {
        str += ` {\n ...browserqlFragment_${ Schema.getName(fieldType)} \n}`
      }
      return str
    })
    schema.extend(`
    fragment browserqlFragment_${ typeName } on ${ typeName } {
      ${ fields.join('\n') }
    }
    `)
  }
}
