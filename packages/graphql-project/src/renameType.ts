import { readFile } from 'fs'
import { join } from 'path'
import { promisify } from 'util'

export default async function renameType(name: string, nextName: string) {
  const source = (
    await promisify(readFile)(join('graphql/types', name, `${name}.graphql`))
  ).toString()
  const nextSource = source.replace(
    new RegExp(`type ${name}`),
    `type ${nextName}`
  )
}
