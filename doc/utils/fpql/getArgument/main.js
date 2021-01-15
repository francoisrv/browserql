import { getArgument, getType, getDirective } from '@browserql/fpql'
import fp from '@browserql/fp'
import gql from 'graphql-tag'

const schema = gql``

fp(schema)(getType('A'), getDirective('foo'), getArgument('bar'))