import { getArgument, getType, getDirective } from '@browserql/fpql'
import fp from '@browserql/fp'

export default fp(schema)(
  // Get type named A
  getType('A'),
  // Get in that type directive named foo
  getDirective('foo'),
  // Get in that directive argument named bar
  getArgument('bar')
)
