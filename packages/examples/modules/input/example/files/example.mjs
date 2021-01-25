import { transformTypeToInput } from '@browserql/input'
import { getType } from '@browserql/fpql'
import { schema } from '../loaders'

const type = getType('Author')(schema)

export default transformTypeToInput(type, schema)
