import * as React from 'react'
import 'refractor'
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
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
} from '@material-ui/core'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark as style } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import Markdown from 'react-markdown'
import gfm from 'remark-gfm'
import {
  Route,
  RouteComponentProps,
  Switch,
  withRouter,
} from 'react-router-dom'
import { kebabCase } from 'lodash'
import { Fragment } from 'react'
import menu, { Menu } from './menu'

const renderers = {
  code: ({ language, value }: { language: string; value: any }) => (
    <SyntaxHighlighter
      showLineNumbers={false}
      style={style}
      language={language}
      children={value}
    />
  ),
  list: List,
  listItem: ({ checked, children, index, node, ordered, spread }: any) => {
    return (
      <ListItem button>
        <ListItemText primary={children[0].props.children[0].props.children} />
      </ListItem>
    )
  },
  table: Table,
  tableHead: TableHead,
  tableBody: TableBody,
  tableRow: TableRow,
  tableCell: TableCell,
}

function App(props: RouteComponentProps) {
  const {
    history,
    location: { pathname },
  } = props
  const [selectedMenu, setSelectedMenu] = React.useState(menu[0])
  const [selectedChild, setSelectedChild] = React.useState<
    Omit<Menu, 'children'>
  >()
  const doc = selectedChild ? selectedChild.doc : selectedMenu.doc

  return (
    <div>
      <Drawer variant="permanent" anchor="left" open>
        <div style={{ width: '18vw' }}>
          <List component="nav">
            {menu.map((item) => (
              <React.Fragment key={item.name}>
                <ListItem
                  button
                  selected={pathname === `/${kebabCase(item.name)}`}
                  onClick={() => {
                    setSelectedChild(undefined)
                    setSelectedMenu(item)
                    history.push(`/${kebabCase(item.name)}`)
                  }}
                >
                  <ListItemText primary={item.name} />
                </ListItem>
                {item.children && (
                  <Collapse in>
                    <List component="div" disablePadding>
                      {item.children.map((child) => (
                        <ListItem
                          button
                          style={{ paddingLeft: 44 }}
                          key={child.name}
                          selected={
                            pathname ===
                            `/${kebabCase(item.name)}/${kebabCase(child.name)}`
                          }
                          onClick={() => {
                            setSelectedMenu(item)
                            setSelectedChild(child)
                            history.push(
                              `/${kebabCase(item.name)}/${kebabCase(
                                child.name
                              )}`
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
          <Switch>
            {menu.map((item) => (
              <Fragment key={item.name}>
                <Route
                  path={`/${kebabCase(item.name)}`}
                  exact
                  component={() => (
                    <Markdown plugins={[gfm]} renderers={renderers}>
                      {item.doc}
                    </Markdown>
                  )}
                />
                {item.children &&
                  item.children.map((child) => (
                    <Route
                      key={child.name}
                      exact
                      path={`/${kebabCase(item.name)}/${kebabCase(child.name)}`}
                      component={() => (
                        <Markdown plugins={[gfm]} renderers={renderers}>
                          {child.doc}
                        </Markdown>
                      )}
                    />
                  ))}
              </Fragment>
            ))}
          </Switch>
        </div>
      </div>
    </div>
  )
}

export default withRouter(App)
