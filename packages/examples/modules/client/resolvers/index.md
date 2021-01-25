The following resolvers are supported:

- queries
- mutations
- scalars
- directives

They are all a dictionnary of functions that receive the following parameters:

- `variables`
- `context`

The context has a reference to the browserql client accessible via `context.browserqlClient`

### Queries and mutations

In this example, we'll use the cache-only state system to store a flag.

This is a good example because here the queries and the mutations are using their context argument in order to access apollo's cache.

This is the schema we'll use:

{{ show schema.graphql }}

This is the query we'll use:

{{ show IS_LOGGED_IN.graphql }}

And the mutations we'll use

{{ show LOGIN.graphql }}

{{ show LOGOUT.graphql }}

Now we create the client:

{{ show client.mjs }}

{{ show view.tsx }}

{{ render app.tsx }}
