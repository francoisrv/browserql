import gql from 'graphql-tag'

export default gql`
directive @firestore(collection: String) on OBJECT

directive @rel(type: String!) on FIELD_DEFINITION

input FirestorePaging {
  page: Int
  rowsPerPage: Int
}

input FirestoreInputWhereID {
  equals: String
  equalsNot: String
}

input FirestoreInputWhereString {
  equals: String
  equalsNot: String
  matches: String
}

input FirestoreInputWhereInt {
  equals: Int
  equalsNot: Int
  below: Int
  above: Int
  belowOrEqual: Int
  aboveOrEqual: Int
}

input FirestoreInputWhereFloat {
  equals: Int
  equalsNot: Int
  below: Int
  above: Int
  belowOrEqual: Int
  aboveOrEqual: Int
}

input FirestoreInputWhereBoolean {
  equals: Boolean
  equalsNot: Boolean
}

input FirestoreInputWhereGeo {
  latitudeEquals: Float
  latitudeEqualsNot: Float
  longitudeEquals: Float
  longitudeEqualsNot: Float
  shapeEquals: [Float]
  shapeEqualsNot: [Float]
}

input FirestoreInputWhereEnum {
  equals: String
  equalsNot: String
}

input FirestoreInputWhereArrayString {
  equals: [String]
  equalsNot: [String]
  includes: String
  includesNot: String
  size: Int
  sizeNot: Int
  includeMatch: String
  includeMatchNot: String
}

input FirestoreInputWhereArrayID {
  equals: [String]
  equalsNot: [String]
  includes: String
  includesNot: String
  size: Int
  sizeNot: Int
}

input FirestoreInputWhereArrayInt {
  equals: [Int]
  equalsNot: [Int]
  includes: Int
  includesNot: Int
  size: Int
  sizeNot: Int
}

input FirestoreInputWhereArrayFloat {
  equals: [Int]
  equalsNot: [Int]
  includes: Int
  includesNot: Int
  size: Int
  sizeNot: Int
}

input FirestoreInputWhereArrayBoolean {
  equals: [Boolean]
  equalsNot: [Boolean]
  includes: Boolean
  includesNot: Boolean
  size: Int
  sizeNot: Int
}
`