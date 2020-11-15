import React, { createContext, useContext } from 'react'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import 'refractor'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'

import { Epic, Prop, PropType, Story } from './types'

// SyntaxHighlighter.registerLanguage('jsx', jsx)

const renderers = {
  code: ({ language, value }: any) => {
    return (
      <SyntaxHighlighter
        style={atomDark}
        language={language}
        children={value}
        showLineNumbers
      />
    )
  },
}

function parseProps(value: any, prop: Prop = {}) {
  if (prop.print) {
    return prop.print(value)
  }
  const { indentation = 2 } = prop
  if (typeof value === 'function') {
    return value.toString()
  }
  if (typeof value === 'object') {
    const bits: { key: string; parsed: string }[] = Object.keys(value).map(
      (key) => ({
        key,
        parsed: parseProps(value[key]),
      })
    )
    return `{\n${' '.repeat(indentation)}${bits
      .map((bit) => `${bit.key}: ${bit.parsed}`)
      .join(`,\n${' '.repeat(indentation)}`)}
${' '.repeat(indentation - 2)}}`
  }
  return JSON.stringify(value, null, 2)
}

function parseSource(source: string, storyProps: any, epicProps: any = {}) {
  let string = source
  for (const key in storyProps) {
    string = string.replace(
      new RegExp(`%${key}%`),
      parseProps(storyProps[key], epicProps[key])
    )
  }
  return string
}

class Ctx {
  source = ''
  started = false
  counter = 0
}

const Context = createContext(new Ctx())

function Printer(props: any) {
  const ctx = useContext(Context)
  ctx.counter++
  console.log(props.children)
  if (!ctx.started) {
    ctx.started = true
    const child = props.children
    return (
      <Printer>
        <child.type {...child.props} />
      </Printer>
    )
  }
  if (ctx.counter > 10) {
    return <div>{ctx.source}</div>
  }
  const child = props.children
  return (
    <Printer>
      <child.type {...child.props} />
    </Printer>
  )
}

export default function printSource<D>(epic: Epic<D>, story: Story<D>) {
  return (
    <pre>
      <ReactMarkdown renderers={renderers} plugins={[gfm]}>{`
  ~~~jsx
  ${parseSource(epic.source || 'NO SOURCE', story.props, epic.props)}
  ~~~
      `}</ReactMarkdown>
    </pre>
  )
}
