import gql from 'graphql-tag'

export default function get(collection: string) {
  return {
    query: gql`
    query {
      firestore_get_${collection}(
        where: [FirestoreWhere]
        filters: FirestoreFilters
      ) {
        id
        name
      }
    }
    `,
  }
}
