import { useQuery } from '@browserql/react-hooks'
import { FIND_QUERY, FIND_ONE_QUERY, FIND_BY_ID_QUERY } from '@browserql/firestore'

export default function useFirestore(path: string) {
  function find(where: any) {
    const queryName = FIND_QUERY(path)
    const queryWhere: any = {}
    for (const key in where) {
      queryWhere[key] = { equals: where[key] }
    }
    return useQuery(queryName, { where: queryWhere })
  }
  
  function findOne(where: any) {
    const queryName = FIND_ONE_QUERY(path)
    const queryWhere: any = {}
    for (const key in where) {
      queryWhere[key] = { equals: where[key] }
    }
    return useQuery(queryName, { where: queryWhere })
  }
  
  function findById(id: string) {
    const queryName = FIND_BY_ID_QUERY(path)
    return useQuery(queryName, { id })
  }
  
  return {
    find,
    findOne,
    findById
  }
}