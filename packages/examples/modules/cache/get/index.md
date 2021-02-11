Get cache entry for a query

Specify a query and it will return the cache entry for it

## Example

{{ render view.tsx }}

## Empty cache

If the cache is empty for the query, it will return either `null` or `undefined`

### Empty cache on a nullable value

If a query's type is nullable (`ID`) and cache is empty, it will return null.

{{ render null.tsx }}

### Empty cache on a non-nullable value

If a query's type is non-nullable (`ID!`) and cache is empty, it will return `undefined`.

{{ render undefined.tsx }}

## Default value

You can also set a default value:

{{ render default.tsx }}
