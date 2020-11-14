import React, { ComponentType, ReactElement, useState } from 'react'
import { Epic, Story } from './types'
import ReactMarkdown from 'react-markdown'
import gfm from 'remark-gfm'
import printSource from './printSource'

export interface StoriesProps<D> {
  epics: Epic<D>[]
}

function EpicsList<D>(props: { epics: Epic<D>[] }) {
  const { epics } = props
  return (
    <ul>
      {epics.map((epic) => (
        <li key={epic.title}>{epic.title}</li>
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
  return (
    <div>
      <h4>{story.title}</h4>
      <ReactMarkdown plugins={[gfm]}>{story.description}</ReactMarkdown>
      <pre>{printSource<D>(epic, story)}</pre>
      <div style={{ border: '5px solid red' }}>
        <epic.renderer {...story.props} />
      </div>
    </div>
  )
}

function EpicView<D>(props: { epic: Epic<D> }) {
  const { epic } = props
  const [selected] = useState(epic.stories[0])

  return (
    <section>
      <header>{epic.title}</header>
      <StoriesList stories={epic.stories} />
      <StoryView story={selected} epic={epic} />
    </section>
  )
}

export default function Stories<D>(props: StoriesProps<D>) {
  const { epics } = props
  const [selected] = useState(epics[0])
  return (
    <section>
      <aside>
        <EpicsList epics={epics} />
      </aside>
      <article>
        <EpicView epic={selected} />
      </article>
    </section>
  )
}
