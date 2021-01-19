import { get } from 'lodash'
import * as React from 'react'
import { ErrorBoundary } from 'react-error-boundary'
// import * as snapshots from '../snapshots'

const snapshots = {}

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
          boxShadow: '0 0 12.5px 12.5px rgba(125, 125, 125, 0.5)',
          borderRadius: 10,
          marginTop: 44,
          marginBottom: 44,
        }}
      >
        <View />
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
