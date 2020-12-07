import * as React from 'react'
import GraphiQL from '@browserql/graphiql'
import { BrowserqlProvider } from '@browserql/react'
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from '@material-ui/core'
import SyntaxHighlighter from 'react-syntax-highlighter'
import { atomOneDark as style } from 'react-syntax-highlighter/dist/esm/styles/hljs'

export default function BrowserqlPlayground() {
  const [schema] = React.useState(`
    extend type Query {
      hello: String!
    }
  `)
  return (
    <div
      style={{
        position: 'relative',
        height: '60vh',
        boxSizing: 'border-box',
        border: '4px solid #444',
        borderRadius: 10,
        overflow: 'auto',
      }}
    >
      <div>
        <Accordion>
          <AccordionSummary>
            <Typography>Schema</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <SyntaxHighlighter
              showLineNumbers={false}
              style={style}
              language="graphql"
              children={schema}
            />
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary>
            <Typography>Queries</Typography>
          </AccordionSummary>
        </Accordion>
      </div>
      <BrowserqlProvider schema={schema}>
        <GraphiQL
          buttonStyle={{
            display: 'none',
          }}
          rootStyle={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            right: 0,
            left: '40%',
            height: '100%',
          }}
          disableDragRoot
          graphiqlProps={{
            query: `
              query {
                hello
              }
            `,
          }}
        />
      </BrowserqlProvider>
    </div>
  )
}
