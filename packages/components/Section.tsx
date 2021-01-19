import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import Typography from '@material-ui/core/Typography'
import { last, startCase } from 'lodash'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import * as React from 'react'
// import { mds } from '../menu'
import MD from './MD'
import Run from './Run'

interface Props {
  link: string
}

const mds = {}

export default function Section({ link }: Props) {
  const bit = last(link.split(/\//))

  return (
    <Accordion
      elevation={0}
      style={{ backgroundColor: '#eee', borderRadius: 8 }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        style={{ backgroundColor: 'white' }}
      >
        <Typography variant="h5">{startCase(bit)}</Typography>
      </AccordionSummary>
      <AccordionDetails style={{ borderRadius: 8 }}>
        <div
          style={{
            flex: 1,
            // borderLeft: '4px dashed #ccc',
            // borderBottom: '4px dashed #ccc',
            paddingLeft: 16,
            paddingRight: 16,
            borderBottomLeftRadius: 22,
            borderTopLeftRadius: 22,
            paddingTop: 16,
            paddingBottom: 16,
            borderRadius: 8,
            // maxHeight: '75vh',
            // overflow: 'auto',
          }}
        >
          <MD
            doc={mds[link as keyof typeof mds] || `Link not found: ${link}`}
          />
        </div>
      </AccordionDetails>
    </Accordion>
  )
}

export function NavSection({
  title,
  description,
  link,
}: {
  title: string
  link: string
  description: string
}) {
  return (
    <Accordion
      elevation={0}
      style={{ backgroundColor: '#eee', borderRadius: 8 }}
    >
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        style={{ backgroundColor: 'white' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flex: 1,
            gap: 8,
          }}
        >
          <Typography variant="h5" style={{ width: 200 }}>
            {title}
          </Typography>
          <Typography
            style={{
              color: '#999',
              flex: 1,
              marginTop: 3,
            }}
            align="center"
          >
            {description}
          </Typography>
        </div>
      </AccordionSummary>
      <AccordionDetails style={{ borderRadius: 8 }}>
        <div
          style={{
            flex: 1,
            // borderLeft: '4px dashed #ccc',
            // borderBottom: '4px dashed #ccc',
            paddingLeft: 16,
            paddingRight: 16,
            borderBottomLeftRadius: 22,
            borderTopLeftRadius: 22,
            paddingTop: 16,
            paddingBottom: 16,
            borderRadius: 8,
            // maxHeight: '75vh',
            // overflow: 'auto',
          }}
        >
          <Run
            doc={mds[link as keyof typeof mds] || `Link not found: ${link}`}
          />
        </div>
      </AccordionDetails>
    </Accordion>
  )
}
