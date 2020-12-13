import gql from 'graphql-tag'

const BASE_SCHEMA = gql`
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
    asc: Boolean
    orderBy: String
    page: Int
    size: Int
  }

  """
  Where operators for Firestore
  """
  input FirestoreWhere {
    field: String!
    operator: FirestoreWhereOperator!
    value: JSON!
  }

  input FirestoreTransformer {
    field: String!
    value: JSON
  }

  """
  Where operators for Firestore
  """
  type FirestoreMutationResponse {
    ok: Boolean!
  }
`

export default BASE_SCHEMA
