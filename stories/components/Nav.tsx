import Collapse from '@material-ui/core/Collapse'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { kebabCase, keys } from 'lodash'
import * as React from 'react'
import { RouteComponentProps, withRouter } from 'react-router-dom'

import menu, { MenuItem } from '../menu'

function Nav(props: RouteComponentProps) {
  const {
    history,
    location: { pathname },
  } = props

  return (
    <div
      style={{
        width: '18vw',
        height: '100vh',
        overflow: 'auto',
        minWidth: 180,
      }}
    >
      <List component="nav">
        {keys(menu).map((menuName) => (
          <React.Fragment key={menuName}>
            <ListItem
              selected={new RegExp(`^\/${kebabCase(menuName)}`).test(pathname)}
            >
              <ListItemText primary={menuName} />
            </ListItem>
            {menu[menuName] && (
              <Collapse in>
                <List component="div" disablePadding>
                  {menu[menuName].map((child) => (
                    <ListItem
                      button
                      style={{ paddingLeft: 44 }}
                      key={child.name}
                      selected={
                        pathname ===
                        `/${kebabCase(menuName)}/${kebabCase(child.name)}`
                      }
                      onClick={() => {
                        history.push(
                          `/${kebabCase(menuName)}/${kebabCase(child.name)}`
                        )
                      }}
                    >
                      <ListItemText primary={child.name} />
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>
    </div>
  )
}

export default withRouter(Nav)
