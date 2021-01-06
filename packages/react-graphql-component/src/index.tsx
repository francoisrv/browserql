import React, { ComponentType } from 'react'

export default function graphqlReact<Fields extends Record<string, any>>(
  source: string | TemplateStringsArray
) {
  function GraphqlComponent(
    Component: ComponentType<Fields>
  ): ComponentType<Fields> {
    return (props: Fields) => <Component {...props} />
  }
  return GraphqlComponent
}

const Todo = graphqlReact<{ title: string; done?: boolean }>`
  type Todo {
    title: String!
    done: Boolean @default(value: false)
  }
  type Mutation {
    edit(title: String, done: Boolean): Boolean!
  }
`(({ done, title }) => (
  <div>
    <h1>{title}</h1>
    <input type="checked" checked={done} />
  </div>
))

function App() {
  return <Todo title="Buy milk" />
}
