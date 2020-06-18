import { Schema } from '@browserql/client'
import { buildWhereArgument } from './buildWhereArgument'

export default function buildWhere(type: any, schema: Schema): string[] {
  const lines: string[] = []
  for (const field of type.fields) {
    lines.push(buildWhereArgument(field, schema))
  }
  return lines
}