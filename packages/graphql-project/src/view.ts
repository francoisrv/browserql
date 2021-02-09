import { readFile, writeFile } from 'fs'
import { promisify } from 'util'

export default async function view(file: string) {
  let schema = ''
  try {
    schema = (await promisify(readFile)(file)).toString()
  } catch (error) {
    schema = ''
    await promisify(writeFile)(file, schema)
  }
  return schema
}
