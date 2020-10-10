import { Children, ReactElement, ReactNode } from 'react';
import { renderToString } from 'react-dom/server'
import { load } from 'cheerio'
import { isArray, keys } from 'lodash';
import React from 'react';

function html($: cheerio.Cheerio) {
  const { tagName } = $.get(0)
  const attrs = $.attr()

  let str = '<'.concat(tagName)

  keys(attrs).forEach(attr => {
    str += ' '
      .concat(attr)
      .concat('="')
      .concat($.attr(attr) as string)
      .concat('"')
  })

  str += '>'
    .concat($.html() as string)
    .concat('</')
    .concat(tagName)
    .concat('>')

  return str
}

class Expect {
  constructor(
    private readonly $: cheerio.Root,
    private readonly target: cheerio.Cheerio
  ) {}

  toHaveType(type: string) {
    const self = this
    this.target.map(
      function (this: cheerio.Cheerio) {
        expect(
          self.$(this).get(0).tagName
        ).toEqual(type)
      }
    )
  }

  toHaveAttr(name?: string, value?: any) {
    expect(this.target.attr(name)).toEqual(value)
  }

  toBe(node: ReactElement) {
    expect(html(this.target)).toEqual(renderToString(node))
  }
}

function Vegeta(props: React.PropsWithChildren<{ ctx: any }>) {
  const children = isArray(props.children) ? props.children : [props.children]
  return props.children
}

function type(value: any) {

}

export default function render(node: ReactElement) {
  const ctx: any = {}

  const string = renderToString(<Vegeta ctx={ctx}>{node}</Vegeta>)
  const $ = load(string)
  const root = $('body > *')
  
  const expect = () => {}
  expect.rootElement = new Expect($, root)
  expect.element = expect.rootElement
  expect.onlyChild = new Expect($, root.children().get(0))

  ctx.expect = expect
  
  return {
    expect,
    type
  }
}
