import * as React from 'react'
import { Stories } from '../packages/stories'
import query from './react/query'

export default function App() {
  return (
    <div>
      App
      <Stories epics={[query]} />
    </div>
  )
}
