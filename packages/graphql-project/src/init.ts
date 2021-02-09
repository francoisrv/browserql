import { mkdir, stat, writeFile } from 'fs'
import { join } from 'path'
import { promisify } from 'util'

const folders = [
  'directives',
  'enumerations',
  'fragments',
  'inputs',
  'mutations',
  'queries',
  'scalars',
  'subscriptions',
  'types',
  'unions',
]

export default async function init() {
  const file = 'graphql.json'
  const folder = 'graphql'

  try {
    await promisify(stat)(file)
    throw new Error('graphql.json already exists')
  } catch (error) {
    if (error.message === 'graphql.json already exists') {
      throw error
    }
  }

  try {
    await promisify(stat)(folder)
    throw new Error('there is already a graphql folder')
  } catch (error) {
    if (error.message === 'there is already a graphql folder') {
      throw error
    }
  }

  await promisify(mkdir)(folder)

  await Promise.all([
    promisify(writeFile)(
      file,
      JSON.stringify(
        {
          version: '1.0.0',
        },
        null,
        2
      )
    ),
    promisify(writeFile)(
      join(folder, 'schema.graphql'),
      `"""
schema
"""
`
    ),
    ...folders.map((def) => promisify(mkdir)(join(folder, def))),
  ])
}
