import * as React from 'react'
import 'refractor'

import Topbar from './components/Topbar'
import Router from './components/Router'
import Nav from './components/Nav'

function App() {
  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        overflow: 'hidden',
      }}
    >
      <Nav />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Topbar />
        <div
          style={{
            height: 'calc(100vh - 64px)',
            overflow: 'auto',
            boxSizing: 'border-box',
            padding: 43,
            paddingTop: 22,
          }}
        >
          <Router />
        </div>
      </div>
    </div>
  )
}

export default App
