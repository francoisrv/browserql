import { readdir } from 'fs'
import { promisify } from 'util'

export default async function types() {
  const files = await promisify(readdir)('graphql/types')
  return files
}
