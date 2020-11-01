import { getType } from '@browserql/fpql'
import { ObjectTypeDefinitionNode } from 'graphql'
import gql from 'graphql-tag'
import { getCollectionName } from './utils'

test('it should get collection name', () => {
  const schema = gql`
    type Foo @firestore {
      id: ID
    }
    type Quantity @firestore {
      id: ID
    }
    type Custom @firestore(collection: "x") {
      id: ID
    }
  `

  const type1 = getType('Foo')(schema)
  expect(getCollectionName(type1 as ObjectTypeDefinitionNode)).toEqual('foos')

  const type2 = getType('Quantity')(schema)
  expect(getCollectionName(type2 as ObjectTypeDefinitionNode)).toEqual(
    'quantities'
  )

  const type3 = getType('Custom')(schema)
  expect(getCollectionName(type3 as ObjectTypeDefinitionNode)).toEqual('x')
})
