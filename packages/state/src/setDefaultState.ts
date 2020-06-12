import { FieldDefinitionNode } from 'graphql'
import { Schema } from '@browserql/client'

export default function setDefaultState(field: FieldDefinitionNode, fallback: any) {
  const params = Schema.getDirectiveParams(field, 'initialState')
  if ('value' in params) {
    return params.value
  }
  return fallback
}