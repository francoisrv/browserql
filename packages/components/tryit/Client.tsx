import React from 'react'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import Typography from '@material-ui/core/Typography'
import { AccordionDetails } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Code from '../Code'
import GraphiQL from '@browserql/graphiql'
import { parse } from 'graphql'
import connect from '@browserql/client'
import { compact } from 'lodash'

interface Props {
  schema: string
  query?: string
  scalars?: string
  queries?: string
}

export default function TryClient({ schema, query, scalars, queries }: Props) {
  const client = connect(parse(schema))
  return (
    <div>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>schema.graphql</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div style={{ flex: 1 }}>
            <Code language="graphql" value={schema} />
          </div>
        </AccordionDetails>
      </Accordion>
      {queries && (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>queries.graphql</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div style={{ flex: 1 }}>
              <Code language="javascript" value={queries} />
            </div>
          </AccordionDetails>
        </Accordion>
      )}
      {scalars && (
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>scalars.graphql</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div style={{ flex: 1 }}>
              <Code language="javascript" value={scalars} />
            </div>
          </AccordionDetails>
        </Accordion>
      )}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>index.ts</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div style={{ flex: 1 }}>
            <Code
              language="javascript"
              value={`import connect from '@browserql/client'
import schema from './schema.graphql'
${queries ? `import * as queries from './queries'` : ''}
${scalars ? `import * as scalars from './scalars'` : ''}

connect(schema, { ${compact([queries && 'queries', scalars && 'scalars']).join(
                ', '
              )} })`}
            />
          </div>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>PREVIEW</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div style={{ flex: 1, height: 500 }}>
            <GraphiQL
              schema={parse(schema)}
              client={client.client}
              graphiqlProps={{
                query,
              }}
            />
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}
