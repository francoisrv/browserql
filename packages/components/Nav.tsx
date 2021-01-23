import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import MenuIcon from '@material-ui/icons/Menu'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Typography from '@material-ui/core/Typography'
import {
  filter,
  find,
  get,
  kebabCase,
  keys,
  map,
  startCase,
  uniq,
} from 'lodash'
import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'
import { useResponsive } from 'react-hooks-responsive'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import { breakpoints } from './utils'
import examples from '@browserql/examples/examples.json'
import versions from '@browserql/examples/versions.json'

function Nav(props: RouteComponentProps & { toggleHidden: () => void }) {
  const {
    history,
    location: { pathname },
  } = props
  const { screenIsAtMost } = useResponsive(breakpoints)
  const sections = uniq(map(examples, 'module'))

  return (
    <div
      style={{
        width: screenIsAtMost('sm', 'portrait') ? '62vw' : '22vw',
        height: '100vh',
        overflow: 'auto',
        // minWidth: 180,
        borderRight: '1px solid #ccc',
        boxSizing: 'border-box',
        position: 'relative',
      }}
    >
      <AppBar position="static" color="default">
        <Toolbar>
          <MenuIcon />
          <Typography variant="h6" style={{ flex: 1 }} align="center">
            {`{ viewDocs }`}
          </Typography>
        </Toolbar>
      </AppBar>
      <div style={{ height: 16 }} />
      {map(sections, (section) => (
        <Accordion key={section} square>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                flex: 1,
              }}
            >
              <Typography>{section}</Typography>
              <Typography color="textSecondary">
                v{get(find(versions, { name: section }), 'version', '')}
              </Typography>
            </div>
          </AccordionSummary>
          <AccordionDetails>
            <List component="nav" disablePadding>
              {map(filter(examples, { module: section }), (example) => (
                <ListItem
                  key={example.name}
                  button
                  onClick={() => {
                    history.push(`/${section}/${example.name}`)
                  }}
                >
                  <ListItemText primary={startCase(example.name)} />
                </ListItem>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
    </div>
  )
}

export default withRouter(Nav)
