import gql from 'graphql-tag'

export default function get(collectionName: string) {
  return {
    query: gql`
    extend type Query {
      firestore_get_${collectionName}: String!
    }
    `,
  }
}
