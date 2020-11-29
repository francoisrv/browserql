import { DocumentNode } from 'graphql'
import gql from 'graphql-tag'

export default function add<Model = any>(
  model: string,
  ...documents: Model[]
): {
  mutation: DocumentNode
  variables: any
} {
  if (documents.length === 1) {
    return {
      mutation: gql`
      mutation AddOne(
        $input: ${model}Input!
      ) {
        firestore_addOne_${model}(
          input: $input
        ) {
          ...${model}Fragment
        }
      }
    `,
      variables: documents[0],
    }
  }
  return {
    mutation: gql`
      mutation AddOne(
        $input: ${model}Input!
      ) {
        firestore_addOne_${model} {
          
        }
      }
    `,
    variables: {},
  }
}
