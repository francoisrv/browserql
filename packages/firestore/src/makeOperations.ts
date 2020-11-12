import { getName } from '@browserql/fpql'
import { transformTypeToInput } from '@browserql/input'
import type {
  ObjectTypeDefinitionNode,
  ObjectTypeExtensionNode,
  DocumentNode,
} from 'graphql'
import { print } from 'graphql'
import gql from 'graphql-tag'
import makeName, { makeNames } from './makeName'

export default function makeOperations(
  type: ObjectTypeDefinitionNode | ObjectTypeExtensionNode,
  schema: DocumentNode
) {
  const name = getName(type)
  const names = makeNames(name)

  return gql`
    extend type ${name} {
      id: ID!
    }

    ${print(transformTypeToInput(type, schema))}

    extend type Query {
      ${names.paginate}(
        where: [FirestoreWhere]
        filters: FirestoreFilters
      ): [ ${name} ! ] !

      ${names.getOne}(
        where: [ FirestoreWhere ]
        filters: FirestoreFilters
      ): ${name}
      
      ${names.getById}(
        id: ID !
      ): ${name}
    }

    extend type Mutation {
      ${names.addOne}(
        input: ${name}Input
      ): ${name}

      ${names.updateOne}(
        where: [FirestoreWhere]
        filters: FirestoreFilters
        transformers: [FirestoreTransformer]
      ): ${name}

      ${names.updateById}(
        id: ID!
        transformers: [FirestoreTransformer]
      ): ${name}
    }
  `
}
