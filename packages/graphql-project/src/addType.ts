import { mkdir, writeFile } from 'fs'
import { join, parse } from 'path'
import { promisify } from 'util'

export default async function addType(name: string) {
  const source = `type ${name}`
  console.log(source)
  parse(source)
  await promisify(mkdir)(join('graphql/types', name))
  await promisify(writeFile)(
    join('graphql/types', name, `${name}.graphql`),
    source.concat('\n')
  )
}
