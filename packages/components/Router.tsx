import { kebabCase, mapKeys } from 'lodash'
import * as React from 'react'
import { Route, RouteProps, Switch } from 'react-router-dom'

import MD from './MD'
import nav from './nav'

const routes: RouteProps[] = []

mapKeys(nav, (section, sectionName) => {
  mapKeys(section, (subSection, subSectionName) => {
    subSection.forEach((example) => {
      console.log(`${kebabCase(sectionName)}/${kebabCase(subSectionName)}`)
      routes.push({
        path: `${kebabCase(sectionName)}/${kebabCase(subSectionName)}`,
        component: () => {
          console.log(123)
          return <div>Hello</div>
          // return <MD doc={example.bundle} />
        },
      })
    })
  })
})

console.log(routes, 2)

export default function Router() {
  return (
    <Switch>
      {routes.map((route) => (
        <Route
          component={route.component}
          exact
          key={route.path as string}
          path={route.path}
        />
      ))}
    </Switch>
  )
}

// <Route path="/utils/fpql" component={() => <div>Hello</div>} />
