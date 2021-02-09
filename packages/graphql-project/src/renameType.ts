import { getName } from '@browserql/fpql'
import { readFile, writeFile } from 'fs'
import { print } from 'graphql'
import { parse } from 'graphql'
import { join } from 'path'
import { promisify } from 'util'

export default async function renameType(
  file: string,
  name: string,
  nextName: string
) {
  const source = (await promisify(readFile)(file)).toString()
  const schema = parse(source)
  const definitions = schema.definitions.map((def) => {
    if (getName(def) === name) {
      return {
        ...def,
        name: {
          kind: 'Name',
          value: nextName,
        },
      }
    }
    return def
  })
  await promisify(writeFile)(file, print({ ...schema, definitions }))
}
