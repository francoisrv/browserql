import { getType } from '@browserql/fpql'
import { parse } from 'graphql'
import view from './view'

export default async function type(file: string, name: string) {
  const schema = parse(await view(file))
  return getType(name)(schema)
}
