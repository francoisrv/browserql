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
      placeholder="Enter name here"
      inputProps={{
        style: {
          fontSize: 24,
          paddingLeft: 8,
          paddingRight: 8,
          backgroundColor: '#555',
          color: '#ffc107',
          borderRadius: '5px 5px 0 0',
        },
      }}
      fullWidth
    />
  )
}
