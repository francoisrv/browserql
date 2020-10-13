const patterns = ['firestore']
const glue = '_'

export default function makeName(...names: string[]) {
  return [...patterns, ...names].join(glue)
}

export function makeNames(collection: string) {
  return {
    paginate: makeName('paginate', collection),
    getOne: makeName('getOne', collection),
    getById: makeName('getById', collection),
    addOne: makeName('addOne', collection),
    addMany: makeName('addMany', collection),
    deleteOne: makeName('deleteOne', collection),
    deleteById: makeName('deleteById', collection),
    deleteMany: makeName('deleteMany', collection),
    updateOne: makeName('updateOne', collection),
    updateById: makeName('updateById', collection),
    updateMany: makeName('updateMany', collection),
  }
}
