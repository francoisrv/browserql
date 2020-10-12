import gql from 'graphql-tag';

export default gql`
scalar JSON

directive @firestore(collection: String) on OBJECT

enum FirestoreWhereOperator {
  EQUALS
}

input FirestoreFilters {
  page: Int
  size: Int
  orderBy: String
}

input FirestoreWhere {
  field: String!
  operator: FirestoreWhereOperator!
  value: JSON!
}
`