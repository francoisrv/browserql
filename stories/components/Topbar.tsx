import AppBar from '@material-ui/core/AppBar'
import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import * as React from 'react'
import MenuIcon from '@material-ui/icons/Menu'
import Typography from '@material-ui/core/Typography'

export default function Topbar({ toggleHidden }: { toggleHidden: () => void }) {
  return (
    <AppBar position="sticky">
      <Toolbar>
        <div />
        <IconButton edge="start" color="inherit" onClick={toggleHidden}>
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" style={{ flex: 1 }}>
          browserql
        </Typography>
      </Toolbar>
    </AppBar>
  )
}
