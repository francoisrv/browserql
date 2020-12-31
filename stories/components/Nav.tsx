import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import Collapse from '@material-ui/core/Collapse'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import { kebabCase, keys } from 'lodash'
import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import menu, { MenuItem } from '../menu'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'

function Nav(props: RouteComponentProps) {
  const {
    history,
    location: { pathname },
  } = props

  return (
    <div
      style={{
        width: '18vw',
        height: '100vh',
        overflow: 'auto',
        minWidth: 180,
        borderRight: '1px solid #ccc',
        boxSizing: 'border-box',
      }}
    >
      <AppBar position="sticky" color="default">
        <Toolbar>
          <Typography variant="h6" style={{ flex: 1 }}>
            docs
          </Typography>
        </Toolbar>
      </AppBar>
      {keys(menu).map((menuName) => (
        <Accordion
          key={menuName}
          square
          defaultExpanded={new RegExp(`^\/${kebabCase(menuName)}`).test(
            pathname
          )}
          style={{
            backgroundColor: 'transparent',
            borderBottom: 'none',
            boxShadow: 'none',
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.25)' }}
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
