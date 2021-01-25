import Button from '@material-ui/core/Button'
import React from 'react'
import { withMutation, UseQuery } from '@browserql/react'
import { flowRight } from 'lodash'

import IS_LOGGED_IN from './IS_LOGGED_IN.graphql'

export default flowRight(
  withMutation`login`(LOGIN),
  withMutation`logout`(LOGOUT)
)(function Inner({ login, logout }) {
  return (
    <UseQuery query={IS_LOGGED_IN}>
      {({ isLoggedIn }) => (
        <Button
          fullWidth
          onClick={isLoggedIn ? login.execute : logout.execute}
          color={isLoggedIn ? 'secondary' : 'primary'}
          variant="contained"
        >
          {isLoggedIn ? 'Log out' : 'Log in'}
        </Button>
      )}
    </UseQuery>
  )
})
