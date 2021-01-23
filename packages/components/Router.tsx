import Breadcrumbs from '@material-ui/core/Breadcrumbs'
import Link from '@material-ui/core/Link'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { kebabCase, mapKeys, startCase } from 'lodash'
import * as React from 'react'
import { Route, RouteProps, Switch, withRouter } from 'react-router-dom'

import MD from './MD'
import nav from './nav'
import examples from '@browserql/examples/examples.json'
import NPMBadge from './NPMBadge'

const routes: RouteProps[] = examples.map((example) => ({
  path: `/${example.module}/${example.name}`,
  component: () => <MD doc={example.bundle} />,
}))

console.log(routes)

export default withRouter(function Router(props) {
  const [, section, example] = props.location.pathname.split(/\//)
  return (
    <>
      <Paper elevation={5} style={{ padding: 16, marginBottom: 28 }}>
        <Typography variant="h5">
          <small>
            <span style={{ color: '#999' }}>{startCase(section)}</span> /{' '}
          </small>
          {startCase(example)}
        </Typography>
      </Paper>
      <NPMBadge pkg={section} />
      <Switch>
        {routes.map((route) => (
          <Route key={route.path as string} {...route} />
        ))}
      </Switch>
    </>
  )
})

// <Route path="/utils/fpql" component={() => <div>Hello</div>} />
