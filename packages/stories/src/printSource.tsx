import React from 'react'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import 'refractor'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism'

import { Epic, Story } from './types'

const renderers = {
  code: ({ language, value }: any) => {
    return (
      <SyntaxHighlighter style={dark} language={language} children={value} />
    )
  },
}

function parseSource(source: string, props: any) {
  let string = source
  for (const key in props) {
    string = string.replace(new RegExp(`%${key}%`), JSON.stringify(props[key]))
  }
  return string
}

export default function printSource<D>(epic: Epic<D>, story: Story<D>) {
  return (
    <pre>
      <ReactMarkdown renderers={renderers} plugins={[gfm]}>{`
~~~jsx
${parseSource(epic.source || 'NO SOURCE', story.props)}
~~~
    `}</ReactMarkdown>
    </pre>
  )
}
