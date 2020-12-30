import Typography from '@material-ui/core/Typography'
import { get, startCase } from 'lodash'
import * as React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import * as snapshots from '../snapshots'

interface Props {
  value: string
}

export default function Snapshot({ value }: Props) {
  const View = get(snapshots, value)

  function Render() {
    return (
      <div
        style={{
          position: 'relative',
          paddingTop: 84,
          boxShadow: '0 5px 5px 5px rgba(0, 0, 0, 0.25)',
          borderRadius: 10,
          marginTop: 16,
          marginBottom: 16,
        }}
      >
        <div style={{ padding: 16, paddingLeft: 33 }}>
          <View />
        </div>
        <div
          style={{
            backgroundColor: '#111',
            color: '#ccc',
            padding: 16,
            borderRadius: '8px 8px 0 0',
            borderBottom: '5px solid #333',
            paddingLeft: 33,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          <Typography>{startCase(value)}</Typography>
        </div>
      </div>
    )
  }

  function RenderError({ error }: { error: Error }) {
    return <div>Some error: {error.message}</div>
  }

  return (
    <ErrorBoundary FallbackComponent={RenderError}>
      <Render />
    </ErrorBoundary>
  )
}
