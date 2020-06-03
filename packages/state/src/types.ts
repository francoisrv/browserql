import { GraphQLField } from 'graphql'

export interface State {
  [type: string]: {
    [field: string]: {
      field: GraphQLField<any, any>,
      value: any
    }
  }
}
