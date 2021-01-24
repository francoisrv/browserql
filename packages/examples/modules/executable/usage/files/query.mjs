import { makeExecutableQuery } from '@browserql/executable'
import { SCHEMA } from '../loaders'

export default makeExecutableQuery(SCHEMA, 'getUser')
