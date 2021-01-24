import { getExecutableOperation } from '@browserql/fpql'
import { parse } from 'graphql'
import schema from './query.graphql'

export default getExecutableOperation('Query2')(parse(schema))