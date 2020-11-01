import { Meta, Story } from '@storybook/react/types-6-0'
import gql from 'graphql-tag'
import React from 'react'
import { BrowserqlProvider } from '../../packages/react'

export default {
  title: 'react/Provider',
  component: BrowserqlProvider,
} as Meta

const Template: Story<any> = (args) => <BrowserqlProvider {...args} />

export const Default = Template.bind({})
Default.args = {
  schema: gql`
    extend type Query {
      id: ID
    }
  `,
}

export const WithError = Template.bind({})
WithError.args = {
  schema: `
    extend
  `,
}

export const WithErrorHandler = Template.bind({})
WithErrorHandler.args = {
  schema: `
    extend 
  `,
  renderError: (p: any) => <div>Custom Error: {p.error.message}</div>,
}
