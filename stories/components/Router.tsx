import { kebabCase, keys } from 'lodash'
import * as React from 'react'
import { Route, Switch } from 'react-router-dom'

import menu, { MenuItem } from '../menu'
import MD from './MD'

export default function Router() {
  const routes = keys(menu).reduce(
    (all, menuName) => [
      ...all,
      ...menu[menuName].map((item) => ({
        ...item,
        menu: menuName,
      })),
    ],
    [] as (MenuItem & { menu: string })[]
  )

  return (
    <Switch>
      {routes.map(({ menu: menuName, name, doc }) => {
        const path = `/${kebabCase(menuName)}/${kebabCase(name)}`
        return <Route key={name} exact path={path} component={() => <div />} />
      })}
    </Switch>
  )
}

/*
{routes.map(({ menu: menuName, name, doc }) => {
        const path = `/${kebabCase(menuName)}/${kebabCase(name)}`
        return (
          <Route
            key={name}
            exact
            path={path}
            component={() => <MD doc={doc} />}
          />
        )
      })}
      */
