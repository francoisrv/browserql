import Code from '@browserql/components/Code'
import React from 'react'
import { makeExecutableQuery } from '@browserql/executable'
import { useQuery } from '@apollo/client'

import { schema } from '../loaders'

const query = makeExecutableQuery(schema, 'getTodo')

export default function Response({ id }: { id: number }) {
  const { data, loading, error } = useQuery(query, {
    variables: { id },
  })

  if (error) return <div>{error.message}</div>

  if (loading) return <div>Loading...</div>

  return <Code language="json" value={JSON.stringify(data, null, 2)} />
}
