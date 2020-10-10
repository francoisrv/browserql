import { FieldDefinitionNode } from 'graphql';
import gql from 'graphql-tag';
import getKind from '../lib/getKind';
import getName from '../lib/getName';
import parseKind from '../lib/parseKind';
import enhanceSchema from '../schema';

const schema = enhanceSchema(gql`
  type Query {
    a: Int
    b: Int!
    c: [Int]
    d: [[Int]]
    e: [[Int!]!]
    f: [[Int]!]
    g: [[Int!]!]!
    h: [[Int]!]!
  }
`);

test('it should parse simple kind', () => {
  const a = schema.getQuery('a');
  const kind = getKind(a as FieldDefinitionNode);
  const parsed = parseKind(kind);
  expect(parsed).toHaveProperty('type', 'Int');
  expect(parsed).toHaveProperty('depth', 0);
  expect(parsed).toHaveProperty('required', false);
  expect(parsed).toHaveProperty('nestedRequired', []);
});

test('it should parse required kind', () => {
  const b = schema.getQuery('b');
  const kind = getKind(b as FieldDefinitionNode);
  const parsed = parseKind(kind);
  expect(parsed).toHaveProperty('type', 'Int');
  expect(parsed).toHaveProperty('depth', 0);
  expect(parsed).toHaveProperty('required', true);
  expect(parsed).toHaveProperty('nestedRequired', []);
});

test('it should parse list kind', () => {
  const c = schema.getQuery('c');
  const kind = getKind(c as FieldDefinitionNode);
  const parsed = parseKind(kind);
  expect(parsed).toHaveProperty('type', 'Int');
  expect(parsed).toHaveProperty('depth', 1);
  expect(parsed).toHaveProperty('required', false);
  expect(parsed).toHaveProperty('nestedRequired', [false]);
});

test('it should parse nested list kind', () => {
  const d = schema.getQuery('d');
  const kind = getKind(d as FieldDefinitionNode);
  const parsed = parseKind(kind);
  expect(parsed).toHaveProperty('type', 'Int');
  expect(parsed).toHaveProperty('depth', 2);
  expect(parsed).toHaveProperty('required', false);
  expect(parsed).toHaveProperty('nestedRequired', [false, false]);
});

test('it should parse nested required list kind', () => {
  const e = schema.getQuery('e');
  const kind = getKind(e as FieldDefinitionNode);
  const parsed = parseKind(kind);
  expect(parsed).toHaveProperty('type', 'Int');
  expect(parsed).toHaveProperty('depth', 2);
  expect(parsed).toHaveProperty('required', false);
  expect(parsed).toHaveProperty('nestedRequired', [true, true]);
});

test('it should parse nested mixed required list kind', () => {
  const f = schema.getQuery('f');
  const kind = getKind(f as FieldDefinitionNode);
  const parsed = parseKind(kind);
  expect(parsed).toHaveProperty('type', 'Int');
  expect(parsed).toHaveProperty('depth', 2);
  expect(parsed).toHaveProperty('required', false);
  expect(parsed).toHaveProperty('nestedRequired', [true, false]);
});

test('it should parse requoired nested required list kind', () => {
  const g = schema.getQuery('g');
  const kind = getKind(g as FieldDefinitionNode);
  const parsed = parseKind(kind);
  expect(parsed).toHaveProperty('type', 'Int');
  expect(parsed).toHaveProperty('depth', 2);
  expect(parsed).toHaveProperty('required', true);
  expect(parsed).toHaveProperty('nestedRequired', [true, true]);
});

test('it should parse required nested mixed required list kind', () => {
  const h = schema.getQuery('h');
  const kind = getKind(h as FieldDefinitionNode);
  const parsed = parseKind(kind);
  expect(parsed).toHaveProperty('type', 'Int');
  expect(parsed).toHaveProperty('depth', 2);
  expect(parsed).toHaveProperty('required', true);
  expect(parsed).toHaveProperty('nestedRequired', [true, false]);
});
