import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import { startCase } from 'lodash'
import * as React from 'react'
import { Route, RouteProps, Switch, withRouter } from 'react-router-dom'
import { Helmet } from 'react-helmet'

import MD from './MD'
import examples from '@browserql/examples/examples.json'

const routes: RouteProps[] = examples.map((example) => ({
  path: `/${example.module}/${example.name}`,
  component: () => <MD doc={example.bundle} />,
}))

export default withRouter(function Router(props) {
  const [, section, example] = props.location.pathname.split(/\//)
  return (
    <>
      <Helmet>
        <title>
          browserql | {startCase(section)} | {startCase(example)}
        </title>
      </Helmet>
      <Paper elevation={5} style={{ padding: 16, marginBottom: 28 }}>
        <Typography variant="h5">
          <small>
            <span style={{ color: '#999' }}>{startCase(section)}</span> /{' '}
          </small>
          {startCase(example)}
        </Typography>
      </Paper>
      <Switch>
        {routes.map((route) => (
          <Route key={route.path as string} {...route} />
        ))}
      </Switch>
    </>
  )
})

// <Route path="/utils/fpql" component={() => <div>Hello</div>} />
