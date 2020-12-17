import * as React from 'react'
import { atomOneDark as style } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import SyntaxHighlighter from 'react-syntax-highlighter'

import BrowserqlPlayground from './BrowserqlPlayground'
import Snapshot from './Snapshot'
import * as components from '../components'

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
        src={`https://codesandbox.io/embed/${value.trim()}?fontsize=14&hidenavigation=1&theme=dark&hidenavigation=0&view=preview`}
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

  if (language === 'component') {
    const raw = value.trim()
    let data
    try {
      data = JSON.parse(raw)
    } catch (error) {
      return <div>Could not parse component data: invalid JSON</div>
    }
    if (typeof data !== 'object' || !data) {
      return <div>Could not parse component data: was expecting object</div>
    }
    if (!data.component) {
      return <div>Missing component's name</div>
    }
    const Component = components[data.component as keyof typeof components]
    if (!Component) {
      return <div>No such component: {value.trim()}</div>
    }
    return <Component {...data.props} />
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
