import React from 'react'
import Chip from '@material-ui/core/Chip'
import Markdown from 'react-markdown'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'
import gfm from 'remark-gfm'

import Code from './Code'

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
  paragraph: ({ children }) => (
    <Typography
      style={{
        lineHeight: '22px',
        paddingBottom: 22,
      }}
    >
      {children}
    </Typography>
  ),
  heading: ({ children, level }) => (
    <Typography variant={`h${Number(level) + 1}`}>{children}</Typography>
  ),
}

export default function MD({ doc }: { doc: string }) {
  return (
    <Markdown plugins={[gfm]} renderers={renderers}>
      {doc}
    </Markdown>
  )
}
