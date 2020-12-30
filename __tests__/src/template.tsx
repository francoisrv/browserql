import React, { ComponentType } from 'react'
import { generateImage } from 'jsdom-screenshot'
import { render } from '@testing-library/react'

export default function testTemplate(Component: ComponentType) {
  it('has no visual regressions', async () => {
    render(<Component />)

    const screenshot = await generateImage()
    expect(screenshot).toMatchImageSnapshot()
  })
}
