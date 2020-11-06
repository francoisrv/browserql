import type { SchemaqlFactory } from '@browserql/types'
import type { GraphQLField } from 'graphql'
import { defaultFieldResolver } from 'graphql'
import gql from 'graphql-tag'
import { SchemaVisitor } from './SchemaVisitor'

class UpperCaseDirective extends SchemaVisitor {
  name = 'default'
  visitFieldDefinition(field: any) {
    console.log(0, { field })
    const { resolve = defaultFieldResolver } = field
    field.resolve = async function (...args: any[]) {
      const result = await resolve.apply(this, args)
      if (typeof result === 'string') {
        return result.toUpperCase()
      }
      return result
    }
  }
}

export default function connectDirectives(): SchemaqlFactory {
  return () => ({
    schema: gql`
      directive @default(value: JSON) on FIELD_DEFINITION
    `,
    directives: {
      // @ts-ignore
      default: UpperCaseDirective,
    },
  })
}
