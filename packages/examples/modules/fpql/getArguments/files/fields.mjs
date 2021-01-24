import { getArguments, getQuery } from '@browserql/fpql'
import fp from '@browserql/fp'
import { FIELDS } from '../loaders'

export default fp(FIELDS)(getQuery('sayHello'), getArguments)
