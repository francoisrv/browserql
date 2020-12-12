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
} from '@material-ui/core'
// import { a11yDark as style } from 'react-syntax-highlighter/dist/esm/styles/prism'
import {
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
} from 'react-router-dom'
import { kebabCase, keys } from 'lodash'
import menu, { MenuItem } from './menu'
import MD from './components/MD'

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
        return (
          <Route
            key={name}
            exact
            path={path}
            component={() => {
              return <MD doc={doc} />
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
