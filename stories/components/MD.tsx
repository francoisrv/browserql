import * as React from 'react'
import Markdown from 'react-markdown'
import gfm from 'remark-gfm'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableHead from '@material-ui/core/TableHead'
import TableBody from '@material-ui/core/TableBody'
import TableRow from '@material-ui/core/TableRow'
import TableCell from '@material-ui/core/TableCell'
import Chip from '@material-ui/core/Chip'

import Code from './Code'
import Typography from '@material-ui/core/Typography'

const renderers = {
  code: ({ language, value }: { language: string; value: any }) => {
    return <Code language={language} value={value} />
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
    <Chip
      color="primary"
      variant="outlined"
      label={children}
      component="span"
    />
  ),
  paragraph: ({ children }) => <Typography>{children}</Typography>,
}

export default function MD({ doc }: { doc: string }) {
  return (
    <Markdown plugins={[gfm]} renderers={renderers}>
      {doc}
    </Markdown>
  )
}
