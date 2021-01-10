# Build Query

```graphql
mutation AddUser($email: String!) {
  addUser(email: $email) {
    ...UserFragment
  }
}
```

```javascript
function AddUser() {
  return (
    <BuildMutation mutation={mutation}>
      {({ get, isRequired, call, loading, error }) => (
        <form onSubmit={call}>
          <input
            type="email"
            required={isRequired('email')}
            value={get('email')}
            onChange={(e) => set('email', e.target.value)}
          />
        </form>
      )}
    </BuildMutation>
  )
}
```

```graphql
query GetUser($id: ID!) {
  getUser(id: $id) {
    ...UserFragment
  }
}
```

```javascript
function GetUser() {
  return (
    <BuildQuery query={query}>
      {({ get, isRequired, call, loading, error, called, data }) => (
        <div>
          <form onSubmit={call}>
            <input
              required={isRequired('id')}
              value={get('id')}
              onChange={(e) => set('id', e.target.value)}
            />
          </form>
          {!loading && data && data.getUser && <h1>{data.getUser.name}</h1>}
        </div>
      )}
    </BuildQuery>
  )
}
```
