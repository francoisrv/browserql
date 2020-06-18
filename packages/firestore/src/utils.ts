type OpType = 'Query' | 'Mutation'

export const FIND_QUERY = (typeName: string, type: OpType) => `firestoreFind_${ type }_${ typeName }`
export const FIND_ONE_QUERY = (typeName: string, type: OpType) => `firestoreFindOne_${ type }_${ typeName }`
export const FIND_BY_ID_QUERY = (typeName: string, type: OpType) => `firestoreFindById_${ type }_${ typeName }`

export const DELETE_QUERY = (typeName: string, type: OpType) => `firestoreDelete_${ type }_${ typeName }`
export const DELETE_ONE_QUERY = (typeName: string, type: OpType) => `firestoreDeleteOne_${ type }_${ typeName }`
export const DELETE_BY_ID_QUERY = (typeName: string, type: OpType) => `firestoreDeleteById_${ type }_${ typeName }`

export const INSERT_QUERY = (typeName: string, type: OpType) => `firestoreInsert_${ type }_${ typeName }`
export const INSERT_MANY_QUERY = (typeName: string, type: OpType) => `firestoreInsertMany_${ type }_${ typeName }`

export const UPDATE_QUERY = (typeName: string, type: OpType) => `firestoreUpdate_${ type }_${ typeName }`
export const UPDATE_ONE_QUERY = (typeName: string, type: OpType) => `firestoreUpdateOne_${ type }_${ typeName }`
export const UPDATE_BY_ID_QUERY = (typeName: string, type: OpType) => `firestoreUpdateById_${ type }_${ typeName }`

