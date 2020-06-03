import React from 'react'
import useRest from 'browserql-rest'

function ViewRestaurants() {
  const [restaurants, { ok }] = useRest().findById('Restaurant', props.restaurantId)

  return (
    <table>
      <thead>
        <tr>
          <td>Name</td>
        </tr>
      </thead>
      <tbody>
      {
        ok && restaurants.map(restaurant => (
          <tr key={ restaurant._id }>
            <td>
              { restaurant.name }
            </td>
          </tr>
        ))
      }
      </tbody>
    </table>
  )
}

function AddRestaurant() {
  const [name, setName] = React.useState('')
  const [addRestaurant] = useRest().post('Restaurant')
  function submit() {
    addRestaurant({ name })
  }
  return (
    <form>
      <input
        value={ name }
        onChange={ e => setName(e.target.value) }
      />
      <input
        type="submit"
        onClick={ submit }
      />
    </form>
  )
}