import * as React from 'react'
import 'refractor'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Typography from '@material-ui/core/Typography'
import {
  Collapse,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark as style } from 'react-syntax-highlighter/dist/esm/styles/hljs'
// import { a11yDark as style } from 'react-syntax-highlighter/dist/esm/styles/prism'
import Markdown from 'react-markdown'
import gfm from 'remark-gfm'
import {
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
} from 'react-router-dom'
import { kebabCase, keys, trim } from 'lodash'
import { Fragment } from 'react'
import menu, { MenuItem } from './menu'
import BrowserqlPlayground from './components/BrowserqlPlayground'
import * as snapshots from './snapshots'

const renderers = {
  code: ({ language, value }: { language: string; value: any }) => {
    if (language === 'browserqlPlayground') {
      return <BrowserqlPlayground />
    }
    if (language === 'sandbox') {
      return (
        <iframe
          src={`https://codesandbox.io/embed/${value.trim()}?fontsize=14&hidenavigation=1&theme=dark&hidenavigation=0&previewwindow=console`}
          style={{
            width: '100%',
            height: 500,
            border: 0,
            borderRadius: 4,
            overflow: 'hidden',
          }}
          title="browserql client"
          allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
          sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
        ></iframe>
      )
    }
    if (language === 'snapshot') {
      const Snapshot = snapshots[value.trim() as keyof typeof snapshots]
      return <Snapshot />
    }
    return (
      <SyntaxHighlighter
        showLineNumbers={false}
        style={style}
        language={language}
        children={value}
      />
    )
  },
  // list: List,
  // listItem: ({ children }: any) => {
  //   return (
  //     <ListItem button>
  //       <ListItemText primary={children[0].props.children[0].props.children} />
  //     </ListItem>
  //   )
  // },
  table: ({ children }) => {
    return (
      <Paper>
        <Table>{children}</Table>
      </Paper>
    )
  },
  tableHead: TableHead,
  tableBody: TableBody,
  tableRow: TableRow,
  tableCell: ({ children }) => {
    return <TableCell>{children}</TableCell>
  },
}

function Renderer({ doc }: { doc: string }) {
  console.log('RENDERING', { doc })
  return (
    <Markdown plugins={[gfm]} renderers={renderers}>
      {doc}
    </Markdown>
  )
}

function Router() {
  const routes = keys(menu).reduce(
    (all, menuName) => [
      ...all,
      ...menu[menuName].map((item) => ({
        ...item,
        menu: menuName,
      })),
    ],
    [] as (MenuItem & { menu: string })[]
  )

  return (
    <Switch>
      {routes.map(({ menu: menuName, name, doc }) => {
        const path = `/${kebabCase(menuName)}/${kebabCase(name)}`
        console.log({ path })
        return (
          <Route
            key={name}
            exact
            path={path}
            component={() => {
              return <Renderer doc={doc} />
            }}
          />
        )
      })}
    </Switch>
  )
}

function Nav(props: RouteComponentProps) {
  const {
    history,
    location: { pathname },
  } = props
  console.log('ROUTER', pathname)

  return (
    <Drawer variant="permanent" anchor="left" open>
      <div style={{ width: '18vw' }}>
        <List component="nav">
          {keys(menu).map((menuName) => (
            <React.Fragment key={menuName}>
              <ListItem
                selected={new RegExp(`^\/${kebabCase(menuName)}`).test(
                  pathname
                )}
              >
                <ListItemText primary={menuName} />
              </ListItem>
              {menu[menuName] && (
                <Collapse in>
                  <List component="div" disablePadding>
                    {menu[menuName].map((child) => (
                      <ListItem
                        button
                        style={{ paddingLeft: 44 }}
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
                </Collapse>
              )}
            </React.Fragment>
          ))}
        </List>
      </div>
    </Drawer>
  )
}

const NavWithRouter = withRouter(Nav)

function Topbar() {
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

function App() {
  return (
    <div>
      <NavWithRouter />
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
