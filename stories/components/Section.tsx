import Accordion from '@material-ui/core/Accordion'
import AccordionDetails from '@material-ui/core/AccordionDetails'
import AccordionSummary from '@material-ui/core/AccordionSummary'
import Typography from '@material-ui/core/Typography'
import { last, startCase } from 'lodash'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import * as React from 'react'
import { mds } from '../menu'
import MD from './MD'

interface Props {
  link: string
}

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
