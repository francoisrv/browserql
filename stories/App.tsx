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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@material-ui/core'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark as style } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import { readFileSync } from 'fs'
import Markdown from 'react-markdown'
import gfm from 'remark-gfm'

interface Menu {
  name: string
  doc: string
  children?: Omit<Menu, 'children'>[]
}

console.log({ gfm })

const renderers = {
  code: ({ language, value }) => (
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

const menu: Menu[] = [
  {
    name: 'Firestore',
    doc: readFileSync(__dirname + '/doc/firestore/index.md', 'utf-8'),
    children: [
      {
        name: 'API',
        doc: readFileSync(__dirname + '/doc/firestore/api.md', 'utf-8'),
      },
      {
        name: 'React',
        doc: readFileSync(__dirname + '/doc/firestore/react.md', 'utf-8'),
      },
      {
        name: 'Schema builder',
        doc: readFileSync(__dirname + '/doc/firestore/react.md', 'utf-8'),
      },
    ],
  },
  {
    name: 'React',
    doc: readFileSync(__dirname + '/doc/react/index.md', 'utf-8'),
    children: [
      {
        name: 'Provider',
        doc: readFileSync(__dirname + '/doc/react/query.md', 'utf-8'),
      },
      {
        name: 'Query',
        doc: readFileSync(__dirname + '/doc/react/query.md', 'utf-8'),
      },
      {
        name: 'Mutation',
        doc: readFileSync(__dirname + '/doc/react/query.md', 'utf-8'),
      },
      {
        name: 'withQuery',
        doc: readFileSync(__dirname + '/doc/react/query.md', 'utf-8'),
      },
      {
        name: 'withMutation',
        doc: readFileSync(__dirname + '/doc/react/query.md', 'utf-8'),
      },
    ],
  },
  {
    name: 'Router',
    doc: readFileSync(__dirname + '/doc/router/index.md', 'utf-8'),
  },
]

export default function App() {
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
                  selected={item.name === selectedMenu.name}
                  onClick={() => {
                    setSelectedChild(undefined)
                    setSelectedMenu(item)
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
                          selected={Boolean(
                            selectedChild &&
                              selectedChild.name === child.name &&
                              item.name === selectedMenu.name
                          )}
                          onClick={() => {
                            setSelectedMenu(item)
                            setSelectedChild(child)
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
          <Markdown plugins={[gfm]} renderers={renderers}>
            {doc}
          </Markdown>
        </div>
      </div>
    </div>
  )
}
