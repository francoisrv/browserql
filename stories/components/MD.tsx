import * as React from 'react'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark as style } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import Markdown from 'react-markdown'
import gfm from 'remark-gfm'

import BrowserqlPlayground from './BrowserqlPlayground'
import * as snapshots from '../snapshots'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Chip from '@material-ui/core/Chip'

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
  inlineCode: ({ children }) => (
    <Chip color="primary" variant="outlined" label={children} />
  ),
}

export default function MD({ doc }: { doc: string }) {
  return (
    <Markdown plugins={[gfm]} renderers={renderers}>
      {doc}
    </Markdown>
  )
}
