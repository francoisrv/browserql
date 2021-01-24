import { makeExecutableMutation } from '@browserql/executable'
import { SCHEMA } from '../loaders'

export default makeExecutableMutation(SCHEMA, 'addUser')
