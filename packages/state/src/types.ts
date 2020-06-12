import { FieldDefinitionNode } from 'graphql'

export interface State {
  [type: string]: {
    [field: string]: {
      field: FieldDefinitionNode,
      value: any
    }
  }
}
