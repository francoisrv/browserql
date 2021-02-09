import { getType } from '@browserql/fpql'
import { writeFile } from 'fs'
import { ObjectTypeDefinitionNode, parse, print } from 'graphql'
import { join } from 'path'
import { promisify } from 'util'
import type from './type'

export default async function addField(
  typeName: string,
  fieldName: string,
  kind: string
) {
  const source = await type(typeName)
  const schema = parse(`${source}\nextend type ${typeName} {
    ${fieldName}: ${kind}
  }`)
  const def = {
    ...(getType(typeName)(schema) as ObjectTypeDefinitionNode),
  }
  await promisify(writeFile)(
    join('graphql/types', typeName, `${typeName}.graphql`),
    print(def)
  )
}
