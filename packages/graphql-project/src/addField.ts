import { getField, getFields, getName, getType } from '@browserql/fpql'
import { writeFile } from 'fs'
import { ObjectTypeDefinitionNode, parse, print } from 'graphql'
import { promisify } from 'util'
import type from './type'
import view from './view'

export default async function addField(
  file: string,
  typeName: string,
  fieldName: string,
  kind: string
) {
  const typeDef = await type(file, typeName)
  if (!typeDef) {
    throw new Error(`No such type: ${typeName}`)
  }
  const source = await view(file)
  const fieldExists = getField(fieldName)(typeDef)
  if (fieldExists) {
    throw new Error(`Field exists: ${typeName}.${fieldName}`)
  }
  const schema = parse(source)
  const schema2 = parse(`type ${typeName} { ${fieldName}: ${kind}}`)
  const fields = getFields(typeDef)
  const newField = getField(fieldName)(getType(typeName)(schema2))
  fields.push(newField)
  const nextSource = print({
    ...schema,
    definitions: schema.definitions.map((def) => {
      if (getName(def) === typeName) {
        return {
          ...def,
          fields,
        }
      }
      return def
    }),
  })
  // console.log(nextSource)
  await promisify(writeFile)(file, nextSource)
}
