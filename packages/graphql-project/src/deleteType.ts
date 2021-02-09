import { getName, getType } from '@browserql/fpql'
import { rmdir, unlink, writeFile } from 'fs'
import { parse, print } from 'graphql'
import { join } from 'path'
import { promisify } from 'util'
import colors from 'colors'
import view from './view'

export default async function deleteType(file: string, name: string) {
  const source = await view(file)
  const schema = parse(source)
  const typeExists = getType(name)(schema)
  if (!typeExists) {
    throw new Error(
      `${colors.red(
        `Can not remove type ${colors.bold(name)}`
      )}: ${colors.yellow('there are no types named like this')}`
    )
  }
  const doc = {
    ...schema,
    definitions: schema.definitions.filter(
      (def) =>
        !(
          def.kind === 'ObjectTypeDefinition' ||
          (def.kind === 'ObjectTypeExtension' && getName(def))
        )
    ),
  }
  const revised = print(doc)
  await promisify(writeFile)(file, revised)
}
