import { rmdir, unlink } from 'fs'
import { join } from 'path'
import { promisify } from 'util'

export default async function deleteType(name: string) {
  await promisify(unlink)(join('graphql/types', name, `${name}.graphql`))
  await promisify(rmdir)(join('graphql/types', name))
}
