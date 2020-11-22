import { BrowserqlProvider, BrowserqlQuery } from '@browserql/react'
import { epics } from '@browserql/stories'
import type { ReactElement, ComponentType } from 'react'
import * as React from 'react'
import gql from 'graphql-tag'
import type { DocumentNode } from 'graphql'
import { print } from 'graphql'

interface StoryProps {
  queries?: object
  query: DocumentNode
  renderer: (response: any) => ReactElement
  schema: DocumentNode | string
  variables?: object
}

function printGraphql(source: any, tab = 4) {
  const p = print(source)
  const aligned = p
    .split(/\n/)
    .map((l) => `${' '.repeat(tab)}${l}`)
    .join('\n')
    .trimRight()
  return 'gql`\n'.concat(aligned).concat(`\n${' '.repeat(tab - 2)}\``)
}

function makeEpic<D>() {
  return {
    title: 'React Query',
    description: 'A React Component that wraps around apollo hooks',
    usage: {},
  }
}

makeEpic<StoryProps>()

export default epics<StoryProps>(
  {
    title: 'BrowserqlQuery',
    description:
      'A React component that wraps the apollo hooks. They do the same thing as hooks -- you would use them for cosmetic preferences only',
    source: `
<BrowserqlProvider
  schema={ %schema% }
  queries={ %queries% }
>
  <BrowserqlQuery
    query={ %query% }
    variables={ %variables% }
    renderError={(e) => <div>{e.message}</div>}
  >
    { %renderer% }
  </BrowserqlQuery>
</BrowserqlProvider>
    `,
    props: {
      schema: {
        print(d: any) {
          return printGraphql(d)
        },
      },
      query: {
        print(d: any) {
          return printGraphql(d, 6)
        },
      },
      queries: {
        indentation: 4,
      },
      variables: {
        indentation: 4,
      },
    },
  },
  function BrowserqlQueryStory(props) {
    const { queries, query, renderer, schema, variables = {} } = props
    return (
      <BrowserqlProvider schema={schema} queries={queries}>
        <BrowserqlQuery
          query={query}
          variables={variables}
          renderError={(e) => <div>{e.message}</div>}
        >
          {renderer}
        </BrowserqlQuery>
      </BrowserqlProvider>
    )
  },
  [
    {
      title: 'Example',
      description: '',
      props: {
        schema: gql`
          extend type Query {
            isWorking: Boolean
          }
        `,
        queries: {
          isWorking: () => true,
        },
        query: gql`
          query {
            isWorking
          }
        `,
        renderer: (isWorking) => (
          <div>{isWorking ? 'is working' : 'is not working'}</div>
        ),
      },
    },

    {
      title: 'Use with variables',
      description: '',
      props: {
        schema: gql`
          extend type Query {
            isWorking: Boolean
          }
        `,
        queries: {
          isWorking: () => true,
        },
        query: gql`
          query {
            isWorking
          }
        `,
        renderer: (isWorking) => (
          <div>{isWorking ? 'is working' : 'is not working'}</div>
        ),
      },
    },
  ]
)
