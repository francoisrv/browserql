Get node's argument by name.

You need to pass it a name, which will return you a function that you call with the target node

#### Get directive's argument

Consider this schema:

{{ show directive.graphql }}

Let's say we want to retrieve the directive argument named `bar`.

We'll do it like this:

{{ show directive.mjs }}

Which will return the following argument node:

{{ render index.tsx }}
