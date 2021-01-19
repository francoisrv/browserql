import * as React from 'react'
import gql from 'graphql-tag'
import { buildFragment } from '@browserql/fragments'
import Code from '../Code'

export function Example() {
  const schema = gql`
    type Post {
      title: String!
      author: Author!
    }

    type Author {
      name: String!
      email: String
    }
  `
  const fragment = buildFragment(schema, 'Author')
  return <Code language="graphql" value={fragment} />
}

export function DefaultName() {
  const schema = gql`
    type Foo {
      name: String
    }
  `
  const fragment = buildFragment(schema, 'Foo')
  return <Code language="graphql" value={fragment} />
}

export function SaveAs() {
  const schema = gql`
    type Foo {
      name: String
    }
  `
  const fragment = buildFragment(schema, 'Foo', { saveAs: 'MyFragment' })
  return <Code language="graphql" value={fragment} />
}

export function Nested() {
  const schema = gql`
    type Post {
      title: String!
      author: Author!
    }

    type Author {
      name: String!
      email: String
    }
  `
  const fragment = buildFragment(schema, 'Post')
  return <Code language="graphql" value={fragment} />
}

export function Select() {
  const schema = gql`
    type Post {
      title: String!
      author: Author!
    }

    type Author {
      name: String!
      email: String
    }
  `
  const fragment = buildFragment(schema, 'Post', { select: ['title'] })
  return <Code language="graphql" value={fragment} />
}

export function InnerSelect() {
  const schema = gql`
    type Recording {
      name: String
      settings: RecordingSettings
    }

    type RecordingSettings {
      name: String
      audioConfiguration: AudioConfiguration
    }

    type AudioConfiguration {
      name: String
      encoder: Encoder
    }

    enum Encoder {
      mp3
      wav
    }
  `
  const fragment = buildFragment(schema, 'Recording', {
    select: ['settings.audioConfiguration.encoder'],
  })
  return <Code language="graphql" value={fragment} />
}

export function NoSuchTypeError() {
  const schema = gql`
    type Foo {
      id: ID
    }
  `
  try {
    const fragment = buildFragment(schema, 'Bar')
    return <Code language="graphql" value={fragment} />
  } catch (error) {
    return <Code language="json" value={error.message} />
  }
}

export function NoSuchNestedType() {
  const schema = gql`
    type Foo {
      bar: Bar
    }
  `
  try {
    const fragment = buildFragment(schema, 'Foo')
    return <Code language="graphql" value={fragment} />
  } catch (error) {
    return <Code language="json" value={error.message} />
  }
}
