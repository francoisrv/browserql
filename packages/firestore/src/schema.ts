import gql from 'graphql-tag'

export default gql`
directive @firestore(collection: String) on OBJECT

directive @rel(type: String!) on FIELD_DEFINITION
`
