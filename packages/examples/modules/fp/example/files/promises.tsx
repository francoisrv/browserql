import Code from '@browserql/components/Code'
import React, { useEffect, useState } from 'react'
import result from './promises.mjs'

export default function App() {
  const [resolved, setResolved] = useState<any>(null)
  const resolve = async () => {
    setResolved(await result())
  }
  useEffect(() => {
    if (!resolved) {
      resolve()
    }
  }, [resolved])
  if (!resolved) {
    return <div>Loading</div>
  }
  return <Code language="json" value={JSON.stringify(resolved, null, 2)} />
}
