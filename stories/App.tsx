import * as React from 'react'
import 'refractor'

import Topbar from './components/Topbar'
import Router from './components/Router'
import Nav from './components/Nav'

function App() {
  return (
    <div>
      <Nav />
      <div>
        <Topbar />
        <div
          style={{ padding: 32, flexGrow: 1, paddingLeft: 'calc(22vw + 32px)' }}
        >
          <Router />
        </div>
      </div>
    </div>
  )
}

export default App
