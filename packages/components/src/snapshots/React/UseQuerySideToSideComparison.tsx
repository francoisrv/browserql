import Typography from '@material-ui/core/Typography'
import React from 'react'
import Code from '../../components/Code'

export default function UseQuerySideToSideComparison() {
  return (
    <div
      style={{
        display: 'flex',
        backgroundColor: '#eee',
        borderRadius: 12,
        alignItems: 'center',
        overflow: 'auto',
      }}
    >
      <div style={{ flex: 1, padding: 12 }}>
        <Typography variant="h6" align="center">
          With Apollo Hooks
        </Typography>
        <Code
          language="javascript"
          value={`import { useQuery } from '@apollo/client'

function SayHello({ to }) {
  const { data, loading, error } = useQuery(QUERY, { variables })

  if (error) return <div>{error.message}</div>

  if (loading) return <div>Loading...</div>

  return <pre>{JSON.stringify(data)}</pre>
}`}
        />
      </div>
      <div style={{ flex: 1, padding: 12 }}>
        <Typography variant="h6" align="center">
          With UseQuery
        </Typography>
        <Code
          language="javascript"
          value={`import { UseQuery } from '@browserql/react'

function SayHello({ to }) {
  return (
    <UseQuery
      query={QUERY}
      variables={variables}
      renderError={({ error }) => <div>{error.message}</div>}
      renderLoading={<div>Loading...</div>}
    >
      {data => <pre>{JSON.stringify(data)}</pre>}
    </UseQuery>
  )
}`}
        />
      </div>
    </div>
  )
}
