const patterns = ['firestore']
const glue = '_'

export default function makeName(...names: string[]) {
  return [...patterns, ...names].join(glue)
}

export function makeNames(collection: string) {
  return {
    paginate: makeName('paginate', name),
    getOne: makeName('getOne', name),
    getById: makeName('getById', name),
    addOne: makeName('addOne', name),
    addMany: makeName('addMany', name),
    deleteOne: makeName('deleteOne', name),
    deleteById: makeName('deleteById', name),
    deleteMany: makeName('deleteMany', name),
    updateOne: makeName('updateOne', name),
    updateById: makeName('updateById', name),
    updateMany: makeName('updateMany', name),
  }
}
