import { Schema, Query, Client } from '@browserql/client'
import { Dictionary } from 'lodash'
import { FIND_QUERY, FIND_ONE_QUERY, FIND_BY_ID_QUERY } from '.'

export default function buildQueries(schema: Schema, queries: Dictionary<Query>, getClient: () => Client) {
  const types = schema.getTypesWithDirective('firestore')
  for (const type of types) {
    const typeName = Schema.getName(type)
    const FIND = FIND_QUERY(typeName, 'Query')
    const FIND_ONE = FIND_ONE_QUERY(typeName, 'Query')
    const FIND_BY_ID = FIND_BY_ID_QUERY(typeName, 'Query')

    queries[FIND] = new Query(FIND, getClient).push(input => {
      const client = getClient()
      client.mutate(FIND_QUERY(typeName, 'Mutation'), input)
    })

    queries[FIND_ONE] = new Query(FIND_ONE, getClient).push(input => {
      const client = getClient()
      client.mutate(FIND_ONE_QUERY(typeName, 'Mutation'), input)
    })

    queries[FIND_BY_ID] = new Query(FIND_BY_ID, getClient).push(input => {
      const client = getClient()
      client.mutate(FIND_BY_ID_QUERY(typeName, 'Mutation'), input)
    })
  }
}