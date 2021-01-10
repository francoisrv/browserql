import * as React from 'react'
import 'refractor'
import Paper from '@material-ui/core/Paper'
import { useResponsive } from 'react-hooks-responsive'

import Topbar from './components/Topbar'
import Router from './components/Router'
import Nav from './components/Nav'
import { breakpoints } from './utils'
import Snapshot from './components/Snapshot'
import { RouteComponentProps, withRouter } from 'react-router-dom'

function Main() {
  const { size, orientation, screenIsAtLeast, screenIsAtMost } = useResponsive(
    breakpoints
  )
  const [hidden, setHidden] = React.useState(true)
  const toggleHidden = React.useCallback(() => {
    setHidden(!hidden)
  }, [hidden])
  const style: React.CSSProperties = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    top: 0,
    left: screenIsAtMost('sm', 'portrait') ? '62vw' : '22vw',
    width: '100vw',
    bottom: 0,
    transition: 'all 0.25s ease-out',
  }

  if (hidden) {
    Object.assign(style, {
      left: 0,
    })
  }

  return (
    <Paper elevation={0} style={style}>
      <Topbar toggleHidden={toggleHidden} />
      <div
        style={{
          height: 'calc(100vh - 64px)',
          overflow: 'auto',
          boxSizing: 'border-box',
          padding: screenIsAtMost('sm', 'portrait') ? 14 : 43,
          paddingTop: screenIsAtMost('sm', 'portrait') ? 8 : 22,
          // lineHeight: screenIsAtMost('sm', 'portrait') ? '2em' : '3em',
          // fontSize: screenIsAtMost('sm', 'portrait') ? '1.2em' : '1.2em',
        }}
      >
        <Router />
      </div>
    </Paper>
  )
}

function App(props: RouteComponentProps) {
  const params = new URLSearchParams(props.location.search)
  const shot = params.get('shot')

  if (shot) {
    return (
      <div style={{ padding: 16 }}>
        <Snapshot value={shot} />
      </div>
    )
  }

  return (
    <div
      style={{
        height: '100vh',
        overflow: 'hidden',
      }}
    >
      <Nav />
      <Main />
    </div>
  )
}

export default withRouter(App)
