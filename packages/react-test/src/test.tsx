import React from 'react'
import render from '.'

function Foo() {
  return <div id="foo">Hello</div>
}

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

test('root element should have element type', () => {
  const node = <h1 />
  const __ = render(node)
  __.expect.rootElement.toHaveType('h1')
})

test('root element should be element', () => {
  const node = <Foo />
  const __ = render(node)
  __.expect.rootElement.toBe(<Foo />)
})

test('root element should have nested type', () => {
  const node = <ul><li /></ul>
  const __ = render(node)
  __.expect.rootElement.toHaveType('ul')
})

test('it should update', () => {
  const node = <Email />
  const I = render(node)
  I.expect.element.toHaveAttr('placeholder', 'Email')
  I.type('ttt')
  I.expect.element.toHaveValue('ttt')
  I.wait.for(1, 'second')
  I.unmount()
})
