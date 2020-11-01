import React from 'react'
import { Story, Meta } from '@storybook/react/types-6-0'

import GraphiQL from '../../packages/graphiql'
import { BrowserqlProvider } from '../../packages/react'
import gql from 'graphql-tag'

export default {
  title: 'react/Graphiql',
  component: GraphiQL,
  argTypes: {
    backgroundColor: { control: 'color' },
  },
} as Meta

const Template: Story<any> = (args) => (
  <BrowserqlProvider schema={args.schema}>
    <GraphiQL />
  </BrowserqlProvider>
)

export const Primary = Template.bind({})
Primary.args = {
  schema: gql`
    extend type Query {
      foo: ID
    }
  `,
}

export const WithError = Template.bind({})
WithError.args = {
  schema: gql`
    extend type Query {
      foo: ID
    }
  `,
}
