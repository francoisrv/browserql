import * as React from 'react'
import { atomOneDark as style } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import SyntaxHighlighter from 'react-syntax-highlighter'

import BrowserqlPlayground from './BrowserqlPlayground'
import * as snapshots from '../snapshots'
import Typography from '@material-ui/core/Typography'
import { startCase } from 'lodash'
import Snapshot from './Snapshot'

export default function Code({
  language,
  value,
}: {
  language: string
  value: any
}) {
  if (language === 'browserqlPlayground') {
    return <BrowserqlPlayground />
  }
  if (language === 'sandbox') {
    // &previewwindow=console
    return (
      <iframe
        src={`https://codesandbox.io/embed/${value.trim()}?fontsize=14&hidenavigation=1&theme=dark&hidenavigation=0`}
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
    return <Snapshot value={value.trim()} />
  }
  return (
    <SyntaxHighlighter
      showLineNumbers={false}
      style={style}
      language={language}
      children={value}
    />
  )
}
