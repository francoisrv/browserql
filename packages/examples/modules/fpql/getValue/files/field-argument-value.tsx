import React from 'react'
import gql from 'graphql-tag'
import Code from '@browserql/components/Code'
import { getValue, getArgument, getQuery, getDirective } from '@browserql/fpql'
import fp from '@browserql/fp'

export default function View() {
  const schema = gql`
    enum Foo {
      Bar
    }

    directive @variant(admin: Boolean!) on FIELD_DEFINITION

    type Query {
      getUser: User @variant(admin: true, foo: Bar)
    }
  `
  return (
    <Code
      language="json"
      value={JSON.stringify(
        fp(schema)(
          getQuery('getUser'),
          getDirective('variant'),
          getArgument('foo'),
          getValue
        ),
        null,
        2
      )}
    />
  )
}

View.height = 500
