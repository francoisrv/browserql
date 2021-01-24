import { getArguments, getQuery } from '@browserql/fpql'
import fp from '@browserql/fp'

fp(schema)(getQuery('sayHello'), getArguments)
