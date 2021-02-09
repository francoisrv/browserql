import { readFile } from 'fs'
import { join } from 'path'
import { promisify } from 'util'

export default async function type(name: string) {
  const file = join('graphql/types', name, `${name}.graphql`)
  return (await promisify(readFile)(file)).toString()
}
