# Fragments

Generate fragments from types (_GraphQL_)

## Example

Let's take a `GraphQL` schema

```graphql
# schema.graphql
type Post {
  title: String!
  author: Author!
}

type Author {
  name: String!
  email: String
}
```

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

```snapshot
FragmentsExample
```

## Nested fragments

Note that if the type is using other types, it will also build fragments for these types:

```javascript
buildFragment(schema, 'Post')
```

Which will generate the following string:

```snapshot
FragmentsExampleNested
```

## Field selection

You can also select the fields:

```javascript
buildFragment(schema, 'Post', {
  select: ['title'],
})
```

```snapshot
FragmentsExampleSelect
```

## Nested field selection

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

```snapshot
FragmentsSelectDotNotation
```
