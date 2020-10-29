import type { DocumentNode } from 'graphql'

export default function stateql(schema: DocumentNode) {
  return {
    get(path: string) {
      return (cache: any) => {
        return 'hello'
      }
    },
  }
}
