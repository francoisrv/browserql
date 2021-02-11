import parseInput from './parseInput'

test('<empty>', () => {
  expect(parseInput()).toEqual({
    definition: undefined,
    typeName: undefined,
    fieldName: undefined,
    argName: undefined,
    kind: undefined,
    newTypeName: undefined,
    newFieldName: undefined,
    newArgName: undefined,
    directiveName: undefined,
  })
})

test('type', () => {
  expect(parseInput('type')).toEqual({
    definition: 'type',
    typeName: undefined,
    fieldName: undefined,
    argName: undefined,
    kind: undefined,
    newTypeName: undefined,
    newFieldName: undefined,
    newArgName: undefined,
    directiveName: undefined,
  })
})

test('type Foo', () => {
  expect(parseInput('type', 'Foo')).toEqual({
    definition: 'type',
    typeName: 'Foo',
    fieldName: undefined,
    argName: undefined,
    kind: undefined,
    newTypeName: undefined,
    newFieldName: undefined,
    newArgName: undefined,
    directiveName: undefined,
  })
})

test('type Foo --delete', () => {
  expect(parseInput('type', 'Foo')).toEqual({
    definition: 'type',
    typeName: 'Foo',
    fieldName: undefined,
    argName: undefined,
    kind: undefined,
    newTypeName: undefined,
    newFieldName: undefined,
    newArgName: undefined,
    directiveName: undefined,
  })
})

test('type Foo.bar', () => {
  expect(parseInput('type', 'Foo.bar')).toEqual({
    definition: 'type',
    typeName: 'Foo',
    fieldName: 'bar',
    argName: undefined,
    kind: undefined,
    newTypeName: undefined,
    newFieldName: undefined,
    newArgName: undefined,
    directiveName: undefined,
  })
})

test('type Foo.bar.foo', () => {
  expect(parseInput('type', 'Foo.bar.foo')).toEqual({
    definition: 'type',
    typeName: 'Foo',
    fieldName: 'bar',
    argName: 'foo',
    kind: undefined,
    newTypeName: undefined,
    newFieldName: undefined,
    newArgName: undefined,
    directiveName: undefined,
  })
})

test('type Foo ID (should not be called)', () => {
  expect(parseInput('type', 'Foo')).toEqual({
    definition: 'type',
    typeName: 'Foo',
    fieldName: undefined,
    argName: undefined,
    kind: undefined,
    newTypeName: undefined,
    newFieldName: undefined,
    newArgName: undefined,
    directiveName: undefined,
  })
})

test('type Foo.bar ID', () => {
  expect(parseInput('type', 'Foo.bar', 'ID')).toEqual({
    definition: 'type',
    typeName: 'Foo',
    fieldName: 'bar',
    argName: undefined,
    kind: 'ID',
    newTypeName: undefined,
    newFieldName: undefined,
    newArgName: undefined,
    directiveName: undefined,
  })
})

test('type Foo.bar.foo ID', () => {
  expect(parseInput('type', 'Foo.bar.foo', 'ID')).toEqual({
    definition: 'type',
    typeName: 'Foo',
    fieldName: 'bar',
    argName: 'foo',
    kind: 'ID',
    newTypeName: undefined,
    newFieldName: undefined,
    newArgName: undefined,
    directiveName: undefined,
  })
})

test('type Foo:Bar', () => {
  expect(parseInput('type', 'Foo:Bar')).toEqual({
    definition: 'type',
    typeName: 'Foo',
    fieldName: undefined,
    argName: undefined,
    kind: undefined,
    newTypeName: 'Bar',
    newFieldName: undefined,
    newArgName: undefined,
    directiveName: undefined,
  })
})

test('type Foo.bar:foo', () => {
  expect(parseInput('type', 'Foo.bar:foo')).toEqual({
    definition: 'type',
    typeName: 'Foo',
    fieldName: 'bar',
    argName: undefined,
    kind: undefined,
    newTypeName: undefined,
    newFieldName: 'foo',
    newArgName: undefined,
    directiveName: undefined,
  })
})

test('type Foo:Bar.bar:foo', () => {
  expect(parseInput('type', 'Foo:Bar.bar:foo')).toEqual({
    definition: 'type',
    typeName: 'Foo',
    fieldName: 'bar',
    argName: undefined,
    kind: undefined,
    newTypeName: 'Bar',
    newFieldName: 'foo',
    newArgName: undefined,
    directiveName: undefined,
  })
})

test('type Foo.bar.foo:bar', () => {
  expect(parseInput('type', 'Foo.bar.foo:bar')).toEqual({
    definition: 'type',
    typeName: 'Foo',
    fieldName: 'bar',
    argName: 'foo',
    kind: undefined,
    newTypeName: undefined,
    newFieldName: undefined,
    newArgName: 'bar',
    directiveName: undefined,
  })
})

test('type Foo @default', () => {
  expect(parseInput('type', 'Foo', '@default')).toEqual({
    definition: 'type',
    typeName: 'Foo',
    fieldName: undefined,
    argName: undefined,
    kind: undefined,
    newTypeName: undefined,
    newFieldName: undefined,
    newArgName: undefined,
    directiveName: 'default',
  })
})
