import fp from '@browserql/fp'
import { getArgument, getQuery } from '@browserql/fpql'
import { MY_SCHEMA } from '../loaders'

export default fp(MY_SCHEMA)(
  getQuery('get'),
  getArgument('id')
)