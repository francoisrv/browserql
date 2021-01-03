import * as React from 'react'
import { atomOneDark as style } from 'react-syntax-highlighter/dist/esm/styles/hljs'
import SyntaxHighlighter from 'react-syntax-highlighter'

import BrowserqlPlayground from './BrowserqlPlayground'
import Snapshot from './Snapshot'
import * as components from '../components'
import Section, { NavSection } from './Section'
import Typography from '@material-ui/core/Typography'
import Link from '@material-ui/core/Link'
import { Chip } from '@material-ui/core'

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
    if (process.env.NODE_ENV === 'development') {
      return (
        <div style={{ padding: 24 }}>
          <Typography>
            <Link
              href={`https://codesandbox.io/embed/${value.trim()}`}
              target="_blank"
            >
              SANDBOX
            </Link>
          </Typography>
        </div>
      )
    }
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

  if (language === 'section-h3') {
    const link = value.trim()
    return <Section link={link} />
  }

  if (language === 'section') {
    const [title, link, description] = value.trim().split(/\n/)
    return <NavSection title={title} description={description} link={link} />
  }

  return (
    <div style={{ position: 'relative' }}>
      <SyntaxHighlighter
        showLineNumbers={false}
        style={style}
        language={language}
        children={value}
      />
      <div
        style={{
          position: 'absolute',
          top: 12,
          right: 12,
        }}
      >
        <Chip color="default" label={language} />
      </div>
    </div>
  )
}
