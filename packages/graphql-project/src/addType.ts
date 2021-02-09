import { getType } from '@browserql/fpql'
import { writeFile } from 'fs'
import { parse } from 'graphql'
import colors from 'colors'
import view from './view'
import { promisify } from 'util'

export default async function addType(
  file: string,
  name: string,
  ...directives: string[]
) {
  const string = `type ${name} ${directives.join(' ')}`
  let source = (await view(file)).trim()
  if (!source) {
    source = string
  } else {
    const typeExists = getType(name)(parse(source))
    if (typeExists) {
      throw new Error(
        `${colors.red(
          `Can not add type ${colors.bold(name)}`
        )}: ${colors.yellow(
          'there is already a type named like this'
        )}.\nType ${colors.magenta(
          `graphql ${file} view type ${name}`
        )} to view it.`
      )
    }
    source = `${source} ${string}`
  }
  await promisify(writeFile)(file, source)
}
