import Typography from '@material-ui/core/Typography'
import { get, startCase } from 'lodash'
import * as React from 'react'
import * as snapshots from '../snapshots'

console.log({ snapshots })

interface Props {
  value: string
}

export default function Snapshot({ value }: Props) {
  const View = get(snapshots, value)
  return (
    <div
      style={{
        position: 'relative',
        paddingTop: 34,
        boxShadow: '0 5px 5px 5px rgba(0, 0, 0, 0.25)',
        borderRadius: 10,
      }}
    >
      <div>
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
