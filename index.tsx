import Render from '@browserql/components/Render'
import * as React from 'react'
import { render } from 'react-dom'
import { BrowserRouter as Router } from 'react-router-dom'

import App from './stories/App'

const [, preview, section, example, file] = window.location.pathname.split(/\//)

if (preview === 'preview') {
  render(
    <Render section={section} example={example} file={file} />,
    document.getElementById('root')
  )
} else {
  render(
    <Router>
      <App />
    </Router>,
    document.getElementById('root')
  )
}
