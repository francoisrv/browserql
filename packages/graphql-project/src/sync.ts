import { writeFile } from 'fs'
import { DocumentNode, print } from 'graphql'
import { promisify } from 'util'

export default async function sync(file: string, schema: DocumentNode) {
  await promisify(writeFile)(file, print(schema))
}
