import { readFile } from 'fs'
import { promisify } from 'util'
import { parse } from 'graphql'
import { getTypes } from '@browserql/fpql'

export default async function types(file: string) {
  const schema = parse((await promisify(readFile)(file)).toString())
  const types = getTypes(schema)
  return types
}
