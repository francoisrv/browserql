import { getField, getFields, getType } from '@browserql/fpql'
import { writeFile } from 'fs'
import { ObjectTypeDefinitionNode, parse, print } from 'graphql'
import { promisify } from 'util'
import type from './type'

export default async function addField(
  file: string,
  typeName: string,
  fieldName: string,
  kind: string
) {
  const typeDef = await type(file, typeName)
  const source = print(typeDef)
  const fieldExists = getField(fieldName)(typeDef)
  if (fieldExists) {
    throw new Error(`Field exists: ${typeName}.${fieldName}`)
  }
  const nextSource = `${source}\nextend type ${typeName} {
    ${fieldName}: ${kind}
  }`
  const schema = parse(nextSource)
  const def = {
    ...(getType(typeName)(schema) as ObjectTypeDefinitionNode),
  }
  // await promisify(writeFile)(file, print(def))
}
