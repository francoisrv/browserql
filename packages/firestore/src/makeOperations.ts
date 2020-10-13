import { getName } from "@browserql/schema";
import type { ObjectTypeDefinitionNode } from "graphql";
import gql from "graphql-tag";
import makeName, { makeNames } from "./makeName";

export default function makeOperations(type: ObjectTypeDefinitionNode) {
  const name = getName(type)
  const names = makeNames(name)
  
  return gql`
    extend type ${name} {
      id: ID!
    }

    extend type Query {
      ${ names.paginate }(
        where: [FirestoreWhere]
        filters: FirestoreFilters
      ): [ ${ name } ! ] !

      ${ names.getOne }(
        where: [ FirestoreWhere ]
        filters: FirestoreFilters
      ): ${ name }
      
      ${ names.getById }(
        id: ID !
      ): ${ name }
      
      ${ names.addOne }(
        document: ${ makeName(name, '_AutoInput') } !
      ): ${ name } !

      ${ names.addMany }(
        documents: [ ${ makeName(name, '_AutoInput') } ! ] !
      ): [ ${ name } ! ] !

      ${ names.deleteOne }(
        where: [ FirestoreWhere ]
        filters: FirestoreFilters
      ): ${ name }

      ${ names.deleteById }(
        id: ID !
      ): ${ name }

      ${ names.deleteMany }(
        where: [ FirestoreWhere ]
        filters: FirestoreFilters
      ): [ ${ name } ! ] !

      ${ names.updateOne }(
        where: [ FirestoreWhere ]
        filters: FirestoreFilters
      ): ${ name }
    }
  `
}
