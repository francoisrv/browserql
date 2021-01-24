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
  includes,
  map,
  sortBy,
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

const items = [
  {
    name: 'GraphQL',
    modules: [
      'cache',
      'client',
      'executable',
      'fragments',
      'graphiql',
      'input',
    ],
  },
  {
    name: 'Integrations',
    modules: ['firestore', 'http', 'state'],
  },
  {
    name: 'React',
    modules: ['react', 'firestore-react'],
  },
  {
    name: 'Utilities',
    modules: ['fp', 'fpql', 'graphql-schema-class', 'typescript-generator'],
  },
]

const SubNav = withRouter(function SubNavView({
  section,
  history,
}: { section: string } & RouteComponentProps) {
  return (
    <Accordion key={section}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-evenly',
            flex: 1,
          }}
        >
          <Typography>{startCase(section)}</Typography>
          <Typography color="textSecondary">
            v{get(find(versions, { name: section }), 'version', '')}
          </Typography>
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <div style={{ flex: 1 }}>
          <List component="nav" disablePadding>
            <ListItem button disabled>
              <ListItemText
                primary={get(
                  find(versions, { name: section }),
                  'description',
                  ''
                )}
                secondary={`npm install @browserql/${section}`}
              />
            </ListItem>
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
        </div>
      </AccordionDetails>
    </Accordion>
  )
})

function Nav(props: RouteComponentProps & { toggleHidden: () => void }) {
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
        position: 'relative',
        backgroundColor: '#eee',
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
      {map(items, (item) => (
        <div key={item.name}>
          <AccordionSummary>
            <Typography
              variant="h5"
              align="center"
              style={{ flex: 1, marginLeft: -24 }}
            >
              {item.name}
            </Typography>
          </AccordionSummary>
          <div style={{ margin: 8 }}>
            {map(
              sortBy(
                filter(examples, (x) => includes(item.modules, x.module)),
                ['module'],
                ['asc']
              ),
              (example) => (
                <SubNav
                  section={example.module}
                  key={`${example.module}.${example.name}`}
                />
              )
            )}
          </div>
        </div>
      ))}
    </div>
  )
}

export default withRouter(Nav)
