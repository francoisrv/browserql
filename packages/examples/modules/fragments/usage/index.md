Generate fragments from types (_GraphQL_)

#### Example

Let's take a `GraphQL` schema

{{ show PostAuthor.graphql }}

Now let's import it along with our fragment builder

```javascript
import schema from './schema.graphql'
import { buildFragment } from '@browserql/fragments'
```

You can now build a fragment specifying the target type

```javascript
buildFragment(schema, 'Author')
```

Which will generate the following string:

```snapshot2
Fragments.Example
```

#### Code sandbox

```sandbox
fragments-cnwol
```

#### API

This is the `Typescript` signature of the `buildFragment` function:

```typescript
buildFragment(
  schema: graphql.DocumentNode
  type: string
  options?: {
    saveAs?: string
    select?: string[]
  }
): string
```

#### Saving as

By default, the name of the new fragment is the type's name suffixed by `Fragment`

```graphql
type Foo {
  name: String
}
```

```javascript
buildFragment(schema, 'Foo')
```

```snapshot2
Fragments.DefaultName
```

Notice here the fragment is named `FooFragment` after the type `Foo`.

You can override this using the `saveAs` property

```javascript
buildFragment(schema, 'Foo', { saveAs: 'MyFragment' })
```

```snapshot2
Fragments.SaveAs
```

#### Nested fragments

Note that if the type is using other types, it will also build fragments for these types:

```javascript
buildFragment(schema, 'Post')
```

Which will generate the following string:

```snapshot2
Fragments.Nested
```

#### Field selection

You can also select the fields:

```javascript
buildFragment(schema, 'Post', {
  select: ['title'],
})
```

```snapshot2
Fragments.Select
```

#### Nested field selection

You can use dot notation to reach nested fields

```graphql
type Recording {
  name: String
  settings: RecordingSettings
}

type RecordingSettings {
  name: String
  audioConfiguration: AudioConfiguration
}

type AudioConfiguration {
  name: String
  encoder: Encoder
}

enum Encoder {
  mp3
  wav
}
```

```javascript
buildFragment(schema, 'Recording', {
  select: ['settings.audioConfiguration.encoder'],
})
```

```snapshot2
Fragments.InnerSelect
```

#### Errors

If the target type does not exist, it will throw an error

```graphql
type Foo {
  id: ID
}
```

```javascript
buildFragment(schema, 'Bar')
```

```snapshot2
Fragments.NoSuchTypeError
```

##### Nested type missing

It will **NOT** throw if a nested type is missing. Instead, it would assume it is a scalar

```graphql
type Foo {
  bar: Bar
}
```

```javascript
buildFragment(schema, 'Foo')
```

```snapshot2
Fragments.NoSuchNestedType
```
