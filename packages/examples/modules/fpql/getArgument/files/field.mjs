import fp from '@browserql/fp'
import { getArgument, getField, getType } from '@browserql/fpql'
import { GRAPHQL } from '../loaders'

export default fp(GRAPHQL)(
  getType('Foo'),
  getField('bar'),
  getArgument('alpha')
)