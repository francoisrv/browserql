import * as React from 'react'
import 'refractor'

import Topbar from './components/Topbar'
import Router from './components/Router'
import Nav from './components/Nav'
import Paper from '@material-ui/core/Paper'

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
      <Paper
        elevation={10}
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
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
      </Paper>
    </div>
  )
}

export default App
