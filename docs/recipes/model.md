# Model

## Usage

```graphql
type Todo @model {
  name: String! @unique
  done: Date
}
```

```js
import connect from '@browserql/client'
import Model from '@browserql/model'

const client = connect({
  schema,
  plugins: [
    Model.plugin()
  ]
})

const models = Model.connect(client)
```

## API

### viewMany

```js
models.get('Todo').viewMany(options) // []
models.get('Todo').insertOne({ name: 'test' })
```

```ts
interface ViewManyOptions {
  where?: ViewWhereOptions[]
  limit?: number
  skip?: number
  orderBy?: OrderByOptions
}

interface ViewWhereOptions {
  field: string
  operator: WhereOperator
  value: any
}

type WhereOperator =
| 'equals'
| 'equalsNot'
| 'isIn'
| 'isNotIn'
| 'isGreaterThan'
| 'isGreaterThanOrEqual'
| 'isLesserThan'
| 'isLesserThanOrEqual'
| 'matches'
| 'matchesNot'
| 'has'
| 'hasNot'
```

## React

```jsx
import connect from '@browserql/client'
import Model from '@browserql/model'
import { useModel } from '@browserql/model-react-hooks'

const client = connect({
  schema,
  plugins: [
    Model.plugin(),
  ]
})

function Todos() {
  const Todo = useModel('Todo')
  const todos = Todo.viewMany({ done: null })
  const [markAsDone] = Todo.useUpdateOne()

  return (
    <ul>
      {
        todos.map(todo => (
          <li key={ todo.name }>
            <input
              type="checkbox"
              onClick={() => markAsDone({ where: [{ name }] }) }
            />
            { todo.name }
          </li>
        ))
      }
    </ul>
  )
}
```
