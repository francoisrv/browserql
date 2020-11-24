import * as React from 'react'
import BrowserqlQuery from './react/query.mdx'
import FirestoreReact from './epics/firestore-react.mdx'
import GraphiQL from './epics/graphiql.mdx'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Typography from '@material-ui/core/Typography'
import CssBaseline from '@material-ui/core/CssBaseline'
import {
  Collapse,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListSubheader,
} from '@material-ui/core'

const components = {
  h1: (props) => <h1>PROPS</h1>,
  h2: (props) => <h2>PROPS</h2>,
  h3: (props) => <h3>PROPS</h3>,
  h4: (props) => <h4>PROPS</h4>,
  h5: (props) => <h5>PROPS</h5>,
  h6: (props) => <h6>PROPS</h6>,
  p: (props) => <p>PROPS</p>,
  code: (props) => <code>PROPS</code>,
}

const epics = [
  {
    title: 'React',
    mdx: () =>
      BrowserqlQuery({
        h1: (props) => <h1>PROPS</h1>,
        h2: (props) => <h2>PROPS</h2>,
        h3: (props) => <h3>PROPS</h3>,
        h4: (props) => <h4>PROPS</h4>,
        h5: (props) => <h5>PROPS</h5>,
        h6: (props) => <h6>PROPS</h6>,
        p: (props) => <p>PROPS</p>,
        code: (props) => <code>PROPS</code>,
      }),
  },
  {
    title: 'Firestore React',
    mdx: FirestoreReact,
  },
  {
    title: 'GraphiQL',
    mdx: GraphiQL,
  },
]

function NavLi(props: { title: React.ReactNode; onClick: () => void }) {
  return (
    <li style={{ display: 'inline', textTransform: 'uppercase' }}>
      <button
        style={{
          fontSize: 16,
          padding: 12,
          textTransform: 'uppercase',
          border: '2px solid #aaa',
          borderBottom: '4px dotted #777',
          borderRadius: '6px 6px 0 0',
          fontWeight: 'bold',
        }}
        onClick={props.onClick}
      >
        {props.title}
      </button>
    </li>
  )
}

function Nav(props: { setEpic: (epic: any) => void }) {
  return (
    <nav>
      <ul style={{ listStyleType: 'none' }}>
        {epics.map((epic) => (
          <NavLi
            key={epic.title}
            title={epic.title}
            onClick={() => props.setEpic(epic)}
          />
        ))}
      </ul>
    </nav>
  )
}

export default function App() {
  const [epic, setEpic] = React.useState(epics[2])

  return (
    <div>
      <Drawer variant="permanent" anchor="left" open>
        <div style={{ width: '22vw' }}>
          <List component="nav">
            <ListItem button>
              <ListItemText primary="React" />
            </ListItem>
            <Collapse in>
              <List component="div" disablePadding>
                <ListItem button style={{ paddingLeft: 44 }}>
                  <ListItemText primary="Query" />
                </ListItem>
              </List>
            </Collapse>
          </List>
        </div>
      </Drawer>
      <div>
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
        <div
          style={{ padding: 32, flexGrow: 1, paddingLeft: 'calc(22vw + 32px)' }}
        >
          <BrowserqlQuery components={components} />
        </div>
      </div>
    </div>
  )
}
