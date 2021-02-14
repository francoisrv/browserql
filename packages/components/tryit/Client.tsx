import React from 'react'
import Accordion from '@material-ui/core/Accordion'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import Typography from '@material-ui/core/Typography'
import { AccordionDetails } from '@material-ui/core'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import Code from '../Code'
import GraphiQL from '@browserql/graphiql'
import { GraphQLScalarType, parse } from 'graphql'
import connect from '@browserql/client'
import { compact } from 'lodash'

interface Props {
  schema: string
  query?: string
  scalars?: Record<string, GraphQLScalarType>
  queries?: Record<string, any>
  subscriptions?: Record<string, any>
  scalarsFile?: string
  queriesFile?: string
  subscriptionsFile?: string
}

export default function TryClient({
  queries,
  queriesFile,
  query,
  scalars,
  scalarsFile,
  schema,
  subscriptionsFile,
  subscriptions,
}: Props) {
  const client = connect(parse(schema), { queries, scalars, subscriptions })
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
      {queriesFile && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>queries.js</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div style={{ flex: 1 }}>
              <Code language="javascript" value={queriesFile} />
            </div>
          </AccordionDetails>
        </Accordion>
      )}
      {scalarsFile && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>scalars.js</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div style={{ flex: 1 }}>
              <Code language="javascript" value={scalarsFile} />
            </div>
          </AccordionDetails>
        </Accordion>
      )}
      {subscriptionsFile && (
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>subscriptions.js</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <div style={{ flex: 1 }}>
              <Code language="javascript" value={subscriptionsFile} />
            </div>
          </AccordionDetails>
        </Accordion>
      )}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>index.js</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div style={{ flex: 1 }}>
            <Code
              language="javascript"
              value={`import connect from '@browserql/client'
import schema from './schema.graphql'
${queries ? `import * as queries from './queries'` : ''}
${scalars ? `import * as scalars from './scalars'` : ''}
${subscriptions ? `import * as subscriptions from './subscriptions'` : ''}

connect(schema, { ${compact([
                queries && 'queries',
                scalars && 'scalars',
                subscriptions && 'subscriptions',
              ]).join(', ')} })`}
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
