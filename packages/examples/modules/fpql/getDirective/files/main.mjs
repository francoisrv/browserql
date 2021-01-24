import { getDirective, getType } from '@browserql/fpql'
import { SCHEMA } from '../loaders'

const type = getType('A')(SCHEMA)
export default getDirective('foo')(type)