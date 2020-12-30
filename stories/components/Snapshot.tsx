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
          boxShadow: '0 5px 5px 5px rgba(0, 0, 0, 0.25)',
          borderRadius: 10,
          marginTop: 44,
          marginBottom: 44,
        }}
      >
        <div style={{ padding: 16, paddingLeft: 33 }}>
          <View />
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
