import { getArguments, getExecutableOperation } from '@browserql/fpql'
import fp from '@browserql/fp'
import { QUERY } from '../loaders'

export default fp(QUERY)(getExecutableOperation('Get'), getArguments)