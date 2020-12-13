import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import * as React from 'react'
import MenuIcon from '@material-ui/icons/Menu'
import Typography from '@material-ui/core/Typography'

export default function Topbar() {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <div style={{ width: '22vw' }} />
        <IconButton edge="start" color="inherit">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" style={{ flex: 1 }}>
          browserql
        </Typography>
      </Toolbar>
    </AppBar>
  )
}
