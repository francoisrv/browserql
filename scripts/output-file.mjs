import { readdir, readFile } from 'fs'
import { join } from 'path'
import { promisify } from 'util'
import gql from 'graphql-tag'

const [, , moduleName, exampleName, fileName] = process.argv

const base = join(
  process.cwd(),
  'packages/examples/modules/',
  moduleName,
  exampleName
)

async function run() {
  try {
    const files = {}
    const fileNames = await promisify(readdir)(join(base, 'files'))
    await Promise.all(
      fileNames.map(async (file) => {
        if (/\.graphql/.test(file)) {
          const source = await promisify(readFile)(join(base, 'files', file))
          files[file] = gql(source.toString())
        }
      })
    )
    globalThis.files = files
    const op = await import(join(base, 'files', fileName))
    console.log(JSON.stringify(op.default, null, 2))
  } catch (error) {
    console.log(JSON.stringify({ error: error.message }, null, 2))
  }
}

run()
