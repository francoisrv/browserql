import * as React from 'react'
import { atomOneDark as style } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import SyntaxHighlighter from 'react-syntax-highlighter'

import BrowserqlPlayground from './BrowserqlPlayground'
import * as snapshots from '../snapshots'
import Typography from '@material-ui/core/Typography'
import { startCase } from 'lodash'

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
    return (
      <div
        style={{
          position: 'relative',
          paddingTop: 34,
          boxShadow: '0 5px 5px 5px rgba(0, 0, 0, 0.25)',
          borderRadius: 10,
        }}
      >
        <div>
          <Snapshot />
        </div>
        <div
          style={{
            backgroundColor: '#111',
            color: '#ccc',
            padding: 16,
            borderRadius: '8px 8px 0 0',
            borderBottom: '5px solid #333',
            paddingLeft: 33,
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
          }}
        >
          <Typography>{startCase(value.trim())}</Typography>
        </div>
      </div>
    )
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
