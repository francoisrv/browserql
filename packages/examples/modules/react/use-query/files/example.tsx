import React from 'react'
import type { DocumentNode } from 'graphql'
import { UseQuery } from '@browserql/react'

interface Props {
  query: DocumentNode
  id: string
}

export default function Example({ query, id }: Props) {
  return (
    <UseQuery
      query={query}
      variables={{ id }}
      renderError={(e) => <h5>{e.message}</h5>}
    >
      {({ getUser: user }) => (
        <div>
          {user === null && <p>No user found with id {id}</p>}
          {user !== null && (
            <p>
              User #{id} is named "{user.name}"
            </p>
          )}
        </div>
      )}
    </UseQuery>
  )
}
