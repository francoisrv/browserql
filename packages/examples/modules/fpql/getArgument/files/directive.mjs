import { getArgument, getType, getDirective } from '@browserql/fpql'

const A = getType('A')(globalThis.files['directive.graphql'])
const foo = getDirective('foo')(A)
const bar = getArgument('bar')(foo)

export default bar