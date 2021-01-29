Tired of writing executable queries/mutations from schema queries/mutations and make sure they stay in-sync? This library generates them for you on the fly directly from the schema.

## Example

Imagine you have the following `GraphQL` schema:

{{ show schema.graphql }}

This is how you would generate an executable query from it:

{{ show query.mjs }}

And this is the query it returns:

{{ render query-render.tsx }}

This is how you would generate an executable mutation from it:

{{ show mutation.mjs }}

And this is the mutation it returns:

{{ render mutation-render.tsx }}
