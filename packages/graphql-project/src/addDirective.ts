import { writeFile } from 'fs'
import { promisify } from 'util'
import view from './view'

export default async function addDirective(
  file: string,
  name: string,
  location: string
) {
  const locations = location
    .split(',')
    .map((loc) => {
      if (loc === 'field') {
        return 'FIELD_DEFINITION'
      }
    })
    .filter(Boolean)
  const string = `directive @${name} on ${locations.join(' | ')}`
  const source = `${string}\n${await view(file)}`
  await promisify(writeFile)(file, source)
}
