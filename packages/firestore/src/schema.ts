import gql from 'graphql-tag'

export default gql`
  directive @firestore(collection: String) on OBJECT

  directive @firestore_ref on FIELD_DEFINITION

  enum FirestoreWhereOperator {
    equals
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
