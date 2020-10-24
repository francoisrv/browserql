# fp

A functional programming pipe chain

```js
import fp from '@browserql/fp'

fp('HELLO WORLD')(
  (string) => string.toLowerCase(),
  (string) => string.split(' '),
  (strings) => strings.map((word) => `(${word})`)
) // [ "(hello)", "(world)" ]
```

Each argument is a function that takes the output of previous function as input.

You can encapsulate functions into an array that looks like this:

`[function, errorHandler]`

The error handler can either throw or return an output

```js
fp()([doSomething(), catchError()])
```

You can specify async for promises:

```js
await fp.promise()(promise1(), promise2())
```
