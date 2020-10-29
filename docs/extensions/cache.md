# Cache

Helpers for apollo cache query

## Usage

```js
import connectCache from '@browserql/cache'

const schema = gql`
  type Query {
    isLoggedIn(user: ID): Boolean!
  }
`

const client = new ApolloClient({
  typeDefs: schema,
})

const cached = connectCache(client.cache, schema)

const isLoggedIn = cached('isLoggedIn')

isLoggedIn.get({ user: '1234' }) // false
isLoggedIn.toggle({ user: '1234' })
isLoggedIn.get({ user: '1234' }) // true
```

## API

### get

```js
state.get('isLoggedIn')
```

## With React

```js
import React from 'react'
import { render } from 'react-dom'
import { BrowserqlProvider } from '@browserql/react'
import { useCache } from '@browserql/cache-react'

function IsUserLoggedIn(props) {
  const { user } = props

  return (
    <Cacheql get="isLoggedIn" variables={{ user }}>
      {(isLoggedIn) => (
        <>
          <Cacheql toggle="isLoggedIn">
            {(toggleIsLoggedIn) => (
              <input
                type="checkbox"
                checked={isLoggedIn}
                onChange={toggleIsLoggedIn}
              />
            )}
          </Cacheql>
          <label>Is user {user} logged in?</label>
        </>
      )}
    </Cacheql>
  )
}

render(
  <BrowserqlProvider schema={schema}>
    <IsloggedIn user="1234" />
  </BrowserqlProvider>
)
```
