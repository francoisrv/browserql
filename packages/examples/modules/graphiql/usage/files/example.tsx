import { BrowserqlProvider } from '@browserql/react'
import React from 'react'
import View from './view'
import { schema } from '../loaders'

export default function Example() {
  const queries = {
    sayHello({ to }: { to: string }) {
      return `hello ${to}`
    },
  }

  const mutations = {
    sayByeTo({ to }: { to: string }) {
      return `bye ${to}`
    },
  }

  return (
    <BrowserqlProvider schema={schema} queries={queries} mutations={mutations}>
      <div
        style={{
          position: 'relative',
          height: 700,
        }}
      >
        <View />
      </div>
    </BrowserqlProvider>
  )
}

Example.height = 700
