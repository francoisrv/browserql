import { BrowserqlProvider, BrowserqlQuery } from '@browserql/react'
import { epics } from '@browserql/stories'
import type { ReactElement, ComponentType } from 'react'
import * as React from 'react'
import gql from 'graphql-tag'
import type { DocumentNode } from 'graphql'

interface StoryProps {
  queries?: object
  query: DocumentNode
  renderer: (response: any) => ReactElement
  schema: DocumentNode | string
  variables?: object
}

export default epics<StoryProps>(
  {
    title: 'React / Query',
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
        type: 'graphql',
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
      description: 'It is **cool**',
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
