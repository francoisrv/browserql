import { BrowserqlProvider } from '@browserql/react'
import React from 'react'

import Inner from './view'
import { SCHEMA } from '../loaders'

export default function View() {
  return (
    <BrowserqlProvider schema={SCHEMA}>
      <Inner />
    </BrowserqlProvider>
  )
}
