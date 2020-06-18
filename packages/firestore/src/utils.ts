type OpType = 'Query' | 'Mutation'

export const FIND_QUERY = (typeName: string, type: OpType) => `firestoreFind_${ type }_${ typeName }`
export const FIND_ONE_QUERY = (typeName: string, type: OpType) => `firestoreFindOne_${ type }_${ typeName }`
export const FIND_BY_ID_QUERY = (typeName: string, type: OpType) => `firestoreFindById_${ type }_${ typeName }`
