import { getField, getFields, getType } from '@browserql/fpql'
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
  const schema = parse(source)
  const fieldExists = getField(fieldName)(typeDef)
  if (fieldExists) {
    throw new Error(`Field exists: ${typeName}.${fieldName}`)
  }
  const nextSource = `${source}\nextend type ${typeName} {
    ${fieldName}: ${kind}
  }`
  // const schema = parse(nextSource)
  // const def = {
  //   ...(getType(typeName)(schema) as ObjectTypeDefinitionNode),
  // }
  // console.log(print(def))
  await promisify(writeFile)(file, nextSource)
}
