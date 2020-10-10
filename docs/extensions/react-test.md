# react-test

# Usage

```jsx
import React from 'react'
import render from '·@browserql/react-test'

function Email() {
  const [value, setValue] = React.useState('')
  return (
    <input
      type="email"
      placeholder="Email"
      value={value}
      onChange={(e) => setValue(e.target.value)}
    />
  )
}

const I = render(<Email />)

test('it should have a placeholder', () => {
  I.expect.element.toHaveAttr('placeholder', 'Email')
})

test('it should update value when I type', () => {
  I.type('ttt')
  I.expect.element.toHaveValue('ttt')
  I.wait.for(1, 'second')
  I.unmount()
})

const I = render(
  <table>
    <thead></thead>
    <tbody>
      <tr>
        <td>Hello</td>
      </tr>
    </tbody>
  </table>
)

test('it should select first td of tbody', () => {
  I.expect('tbody td:first-child').toBe(<td>Hello</td>)
})
```

# I

## change

```ts
I.change: (node?: string | ReactElement | React.ComponentType) => void
```

## click

```ts
I.click: (node?: string | ReactElement | React.ComponentType) => void
```

## expect

```ts
I.expect: (node: string | ReactElement | React.ComponentType) => Expect
```

### child

```ts
I.expect.child: (node: string | ReactElement | React.ComponentType) => Expect
```

### element

```ts
I.expect.element: Expect
```

### firstChild

```ts
I.expect.firstChild: Expect
```

### lastChild

```ts
I.expect: (node: string | ReactElement) => Expect
```

### onlyChild

```ts
I.expect: (node: string | ReactElement) => Expect
```

### root

```ts
I.expect: (node: string | ReactElement) => Expect
```

### rootElement

```ts
I.expect: (node: string | ReactElement) => Expect
```

## type

```ts
I.type: (node?: string | ReactElement | React.ComponentType) => void
```

## wait

```ts
I.wait: (node?: string | ReactElement | React.ComponentType) => void
```
