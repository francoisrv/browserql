import { readFile } from 'fs'
import { promisify } from 'util'

export default async function type(file: string, name: string) {
  return (await promisify(readFile)(file)).toString()
}
