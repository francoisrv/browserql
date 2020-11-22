import gql from 'graphql-tag'

export default gql`
  directive @firestore(collection: String) on OBJECT

  directive @firestore_ref on FIELD_DEFINITION

  enum FirestoreWhereOperator {
    equals
    isGreaterThan
    isGreaterThanOrEqualTo
    isIn
    isLesserThan
    isLesserThanOrEqualTo
  }

  input FirestoreFilters {
    page: Int
    size: Int
    orderBy: String
    asc: Boolean
  }

  input FirestoreWhere {
    field: String!
    operator: FirestoreWhereOperator!
    value: JSON!
  }

  input FirestoreTransformer {
    field: String!
    value: JSON
  }

  type FirestoreMutationResponse {
    ok: Boolean!
  }
`
