import gql from 'graphql-tag'

export default gql`
directive @firestore(collection: String) on OBJECT

directive @rel(type: String!) on FIELD_DEFINITION

input FirestoreQueryWhere {
  field: String!
  operator: String!
  value: JSON!
}

input FirestoreQueryFilters {
  startsAt: Int
  endsAt: Int
  orderBy: String
  where: [ FirestoreQueryFilters ]
}
`
