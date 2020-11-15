import React, { ComponentType, ReactElement, useState } from 'react'
import { Epic, Story } from './types'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import printSource from './printSource'
import 'refractor'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { MDXProvider } from '@mdx-js/react'

export interface StoriesProps<D> {
  epics: Epic<D>[]
}

interface ListItem {
  name: string
  children: ListItem[]
}

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

function makeList<D>(epics: Epic<D>[]): ListItem[] {
  const items: ListItem[] = []
  for (const { title } of epics) {
    const paths = title.split(/\//)
    const os = [...paths]
    let current = paths[0]
    while (os.length > 0) {
      const p = os.shift()
      items.push({
        name: current,
        children: [],
      })
    }
  }
  return items
}

function EpicsList<D>(props: { epics: Epic<D>[] }) {
  const { epics } = props
  return (
    <ul style={{ listStyleType: 'none', paddingRight: 50 }}>
      {epics.map((epic) => (
        <li key={epic.title} style={{ display: 'inline' }}>
          <button
            style={{ fontSize: 16, padding: 12, textTransform: 'uppercase' }}
          >
            {epic.title}
          </button>
        </li>
      ))}
    </ul>
  )
}

function StoriesList<D>(props: { stories: Story<D>[] }) {
  const { stories } = props
  return (
    <ul>
      {stories.map((story) => (
        <li key={story.title}>{story.title}</li>
      ))}
    </ul>
  )
}

function StoryView<D>(props: { story: Story<D>; epic: Epic<D> }) {
  const { story, epic } = props
  // return (
  //   <div>
  //     <h4>{story.title}</h4>
  //     <ReactMarkdown plugins={[gfm]}>{story.description}</ReactMarkdown>
  //     <pre>{printSource<D>(epic, story)}</pre>
  //     <div style={{ border: '5px solid red' }}>
  //       <epic.renderer {...story.props} />
  //     </div>
  //   </div>
  // )

  return (
    <ReactMarkdown>{`### ${story.title}
  `}</ReactMarkdown>
  )
}

function EpicView<D>(props: { epic: Epic<D> }) {
  const { epic } = props
  const [selected] = useState(epic.stories[0])

  // return (
  //   <section>
  //     <h2>{epic.title}</h2>
  //     <StoriesList stories={epic.stories} />
  //     <StoryView story={selected} epic={epic} />
  //   </section>
  // )

  //   return (
  //     <ReactMarkdown>{`# ${epic.title}

  // ${epic.description}

  // ${epic.stories.map((story) => `- ${story.title}`).join('\n')}

  // ## Stories

  // ${epic.stories
  //   .map(
  //     (story) => `
  // ### ${story.title}

  // ${story.description}
  // `
  //   )
  //   .join('\n\n')}
  //   `}</ReactMarkdown>
  //   )

  const md = `# Hello`

  return <MDXProvider components={{ h1: H1 }}># Hello</MDXProvider>
}

const H1 = (props) => <h1 style={{ color: 'tomato' }} {...props} />

export default function Stories<D>(props: StoriesProps<D>) {
  const { epics } = props
  const [selected] = useState(epics[0])
  return (
    <section style={{ display: 'flex' }}>
      <aside>
        <EpicsList epics={epics} />
      </aside>
      <article>
        <EpicView epic={selected} />
      </article>
    </section>
  )
}
