import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import GitHubIcon from '@material-ui/icons/GitHub'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import { kebabCase, keys } from 'lodash'
import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import BugReportIcon from '@material-ui/icons/BugReport'
import { useResponsive } from 'react-hooks-responsive'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import TextField from '@material-ui/core/TextField'
import menu from '../menu'
import { breakpoints } from '../utils'

function Nav(props: RouteComponentProps) {
  const {
    history,
    location: { pathname },
  } = props
  const { size, orientation, screenIsAtLeast, screenIsAtMost } = useResponsive(
    breakpoints
  )

  return (
    <div
      style={{
        width: screenIsAtMost('sm', 'portrait') ? '62vw' : '22vw',
        height: '100vh',
        overflow: 'auto',
        // minWidth: 180,
        borderRight: '1px solid #ccc',
        boxSizing: 'border-box',
      }}
    >
      <AppBar position="sticky" color="default">
        <Toolbar>
          <Typography variant="h6" style={{ flex: 1 }} align="center">
            {`{ viewDocs }`}
          </Typography>
        </Toolbar>
      </AppBar>
      <Toolbar>
        <IconButton>
          <GitHubIcon />
        </IconButton>
        <IconButton>
          <BugReportIcon />
        </IconButton>
      </Toolbar>
      <Toolbar>
        <TextField fullWidth placeholder="Search..." />
      </Toolbar>
      <div style={{ height: 16 }} />
      {keys(menu).map((menuName) => (
        <Accordion
          key={menuName}
          square
          defaultExpanded={new RegExp(`^\/${kebabCase(menuName)}`).test(
            pathname
          )}
          style={{
            borderBottom: 'none',
            boxShadow: 'none',
            backgroundColor: 'transparent',
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            style={{ backgroundColor: '#fff' }}
          >
            <Typography>{menuName}</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div style={{ flex: 1 }}>
              <List component="nav" disablePadding>
                {menu[menuName].map((child) => (
                  <ListItem
                    button
                    key={child.name}
                    selected={
                      pathname ===
                      `/${kebabCase(menuName)}/${kebabCase(child.name)}`
                    }
                    onClick={() => {
                      history.push(
                        `/${kebabCase(menuName)}/${kebabCase(child.name)}`
                      )
                    }}
                  >
                    <ListItemText primary={child.name} />
                  </ListItem>
                ))}
              </List>
            </div>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  )
}

export default withRouter(Nav)
