import { buildFragment } from '@browserql/fragments'
import { SCHEMA } from '../loaders'

// You can now build a fragment specifying the target type
export default buildFragment(SCHEMA, 'Author')
