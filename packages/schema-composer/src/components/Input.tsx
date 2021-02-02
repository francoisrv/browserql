import TextField from '@material-ui/core/TextField'
import React from 'react'

interface Props {
  value: any
  onChangeValue: (value: any) => void
}

export default function Input({ value, onChangeValue }: Props) {
  return (
    <TextField
      value={value}
      onChange={(e) => onChangeValue(e.target.value)}
      inputProps={{
        style: {
          fontSize: 24,
          paddingLeft: 20,
          paddingRight: 20,
          backgroundColor: '#444',
          color: '#fff',
        },
      }}
      fullWidth
    />
  )
}
