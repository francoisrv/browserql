import { writeFile } from 'fs'
import { promisify } from 'util'
import type from './type'
import types from './types'

export default async function sync() {
  const typeNames = await types()
  const typeDefs = await Promise.all(typeNames.map(type))
  await promisify(writeFile)('graphql/schema.graphql', typeDefs.join('\n'))
}
