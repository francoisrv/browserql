import { getArgument, getKind, getQuery } from '@browserql/fpql'
import fp from '@browserql/fp'
import { schema1 } from '../loaders'

export default fp(schema1)(getQuery('exists'), getArgument('user'), getKind)