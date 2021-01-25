Fire HTTP queries from your front end using GraphQL!

## Show me!

In your `GraphQL` schema, just tag your operations that are meant to fire HTTP requests with our `http` directive:

{{ show schema.graphql }}

Now just fire a `GraphQL` query:

{{ show query.graphql }}

This is the result from the HTTP request:

{{ render app.tsx }}
