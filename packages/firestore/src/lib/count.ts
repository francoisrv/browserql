import gql from 'graphql-tag'

export default function count(collection: string) {
  return {
    query: gql`
    query {
      firestore_count_${collection}(
        where: [FirestoreWhere]
        filters: FirestoreFilters
      )
    }
    `,
  }
}
