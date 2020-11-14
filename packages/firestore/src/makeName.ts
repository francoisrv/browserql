const patterns = ['firestore']
const glue = '_'
const names = [
  'paginate',
  'getOne',
  'getById',
  'addOne',
  'updateOne',
  'updateById',
]

export default function makeName(...names: string[]) {
  return [...patterns, ...names].join(glue)
}

export function makeNames(collection: string): { [k: string]: string } {
  return names.reduce(
    (all, name) => ({
      ...all,
      [name]: makeName(name, collection),
    }),
    {}
  )
}
