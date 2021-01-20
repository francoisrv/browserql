import 'graphql-import-node';
import { getArgument, getType, getDirective } from '@browserql/fpql'
import fp from '@browserql/fp'
import schema from './schema.graphql'

export default fp(schema)(getType('A'), getDirective('foo'), getArgument('bar'))
