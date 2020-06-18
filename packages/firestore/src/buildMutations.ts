import { Schema, Mutation, Client } from '@browserql/client'
import { Dictionary } from 'lodash'

export default function buildMutations(
  schema: Schema,
  mutations: Dictionary<Mutation>,
  getClient: () => Client,
  db: any
) {
  const types = schema.getTypesWithDirective('firestore')

  for (const type of types) {
    const typeName = Schema.getName(type)
    let collectionName = typeName?.toLowerCase()
    if (/y$/.test(typeName)) {
      collectionName = collectionName?.replace(/y$/, 'ies')
    } else {
      collectionName += 's'
    }
  }
}