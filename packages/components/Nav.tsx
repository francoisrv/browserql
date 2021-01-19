import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import { kebabCase, keys } from 'lodash'
import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { useResponsive } from 'react-hooks-responsive'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import { breakpoints } from './utils'
import nav from './nav'

function Nav(props: RouteComponentProps) {
  const {
    history,
    location: { pathname },
  } = props
  const { screenIsAtMost } = useResponsive(breakpoints)

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
      <div style={{ height: 16 }} />
      {keys(nav).map((menuName) => (
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
                {keys(nav[menuName as keyof typeof nav]).map((childName) => (
                  <ListItem
                    button
                    key={childName}
                    selected={
                      pathname ===
                      `/${kebabCase(menuName)}/${kebabCase(childName)}`
                    }
                    onClick={() => {
                      history.push(
                        `/${kebabCase(menuName)}/${kebabCase(childName)}`
                      )
                    }}
                  >
                    <ListItemText primary={childName} />
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
