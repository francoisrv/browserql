import { getArguments, getType, getDirective } from '@browserql/fpql'
import fp from '@browserql/fp'
import { DIRECTIVES } from '../loaders'

export default fp(DIRECTIVES)(getType('User'), getDirective('model'), getArguments)