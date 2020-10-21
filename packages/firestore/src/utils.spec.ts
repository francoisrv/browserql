import enhanceSchema from '@browserql/schema'
import { ObjectTypeDefinitionNode } from 'graphql'
import gql from 'graphql-tag'
import { getCollectionName } from './utils'

test('it should get collection name', () => {
  const schema = enhanceSchema(gql`
    type Foo @firestore { id: ID }
    type Quantity @firestore { id: ID }
    type Custom @firestore(collection: "x") { id: ID }
  `)
  
  const type1 = schema.getType('Foo')
  expect(getCollectionName(type1 as ObjectTypeDefinitionNode)).toEqual('foos')

  const type2 = schema.getType('Quantity')
  expect(getCollectionName(type2 as ObjectTypeDefinitionNode)).toEqual('quantities')

  const type3 = schema.getType('Custom')
  expect(getCollectionName(type3 as ObjectTypeDefinitionNode)).toEqual('x')
})