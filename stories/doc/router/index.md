# Router

```jsx
import buildRouter from '@browserql/router'
import Router, { useRouter } from '@browserql/router-react'
import ApolloClient from '@apollo/client'

const { schema, queries, mutations } = buildRouter()

const client = new ApolloClient({
  typeDefs: [schema],
  resolvers: {
    Query: { ...queries },
    Mutation: { ...mutations },
  },
})

function App() {
  const [path, setPath] = useRouter()
  const routes = [
    {
      path: '/',
      component: () => <h1>Home</h1>,
    },
    {
      path: '/contact',
      component: () => <h1>Contact</h1>,
    },
  ]
  const titles = ['Home', 'Contact']

  return (
    <main>
      <ul>
        {routes.map(({ path }, i) => (
          <li key={path} onClick={() => setPath(path)}>
            {titles[i]}
          </li>
        ))}
      </ul>
      <Router routes={routes} />
    </main>
  )
}
```
