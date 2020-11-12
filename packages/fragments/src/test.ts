import buildFragments from '.'

function toMacthLines(a: string, b: string) {
  const as = a.split('\n')
  const bs = b.split('\n')
  as.forEach((aa, index) => {
    expect(aa.trim()).toEqual(bs[index].trim())
  })
}

const schema = `
type Category {
  id: ID!
  name: String!
}

type Todo {
  id: ID!
  name: String!
  done: Boolean!
  category: Category!
}

type User {
  id: ID
}

type Post {
  users: [User]
}

type Query {
  getTodo: Todo
}

type Mutation {
  getPosts: Post
}
`

function verifySource(a: string, b: string) {
  const A = a.split('\n').filter(Boolean)
  const B = b.split('\n').filter(Boolean)
  expect(A).toHaveLength(B.length)
  A.forEach((l, i) => expect(l.trim()).toEqual(B[i].trim()))
}

test('[query] it should print fragment', () => {
  const fragments = buildFragments(schema)
  const category = fragments.get('Category')
  verifySource(
    category as string,
    `fragment CategoryFragment on Category {
    id
    name
    __typename
  }`
  )
})

test('[query] it should print nested fragments', () => {
  const fragments = buildFragments(schema)
  const todo = fragments.get('Todo')
  verifySource(
    todo as string,
    `fragment TodoFragment on Todo {
      id
      name
      done
      category {
        ...CategoryFragment 
      }
      __typename
    }
    fragment CategoryFragment on Category {
      id
      name
      __typename
    }`
  )
})

test('[mutation] it should print fragment', () => {
  const fragments = buildFragments(schema)
  const user = fragments.get('User')
  verifySource(
    user as string,
    `fragment UserFragment on User {
    id
    __typename
  }`
  )
})

test('[mutation] it should print nested fragments', () => {
  const fragments = buildFragments(schema)
  const todo = fragments.get('Post')
  expect(todo?.split('\n')).toEqual(
    `fragment PostFragment on Post {
  users {
    ...UserFragment 
  }
  __typename
}
fragment UserFragment on User {
  id
  __typename
}`.split('\n')
  )
})

test('bug 233', () => {
  const fragments = buildFragments(`
  type Query {
    browserqlQuery: ID
    getCustomerOrderHistory(customer: String!): OrderHistoryResponse! @lambda
    getCustomerQueue(customer: String!): QueueResponse! @lambda
    getReferrals(customer: String!): ReferralsResponse! @lambda
    getShopCustomers(shopName: String!): CustomersResponse! @lambda
    shopify(create: Boolean, ids: [BigInt], limit: Int, product: BigInt, productId: BigInt, productVariant: BigInt, productVariants: Boolean, products: Boolean, shopName: String!): JSON @lambda
  }
  
  type Mutation {
    browserqlMutation: ID
    addItemToQueue(cid: String!, planId: String!, shopifyProductId: Int!, shopifyProductVariantId: Int!): QueueResponse! @lambda
    fulfillOrder(customer: String!, shopifyProductVariantId: BigInt!): [Order!]! @lambda(method: POST)
  }
  
  type QueueResponse {
    queue: [Order!]!
  }
  
  type OrderHistoryResponse {
    orderHistory: [Order!]!
  }
  
  type ShippingAddress {
    city: String
    state: String
    streetAddress: String
    zipCode: String
  }
  
  type SubscriptionItemPriceRecurring {
    interval: String
    interval_count: Int
    trial_period_days: Int
  }
  
  type SubscriptionItemPrice {
    active: Boolean
    created: Int
    currency: String
    id: String
    livemode: Boolean
    nickname: String
    product: String
    recurring: SubscriptionItemPriceRecurring
    unit_amount: Int
  }
  
  type SubscriptionItem {
    id: String
    created: Int
    price: SubscriptionItemPrice
    quantity: Int
    subscription: String
  }
  
  type SubscriptionItemData {
    data: [SubscriptionItem]
  }
  
  type Subscription {
    billing_cycle_anchor: Int
    cancel_at: Int
    cancel_at_period_end: Boolean @default(value: false)
    canceled_at: Int
    created: Int
    current_period_end: Int
    current_period_start: Int
    customer: ID
    id: ID
    items: SubscriptionItemData @default(value: [])
    start_date: Int
    status: ID
  }
  
  type Customer {
    acceptsMarketing: Boolean
    cid: String!
    email: String
    firstName: String
    lastUpdated: Int
    shippingAddress: ShippingAddress
    shopName: String!
    sid: String @deprecated
    stripeId: String!
    subscriptions: [Subscription] @default(value: [])
    totalOrders: Int @default(value: 0)
    totalSpent: Int @default(value: 0)
  }
  
  type Order {
    cid: String!
    dateCreated: Date @default(function: "now")
    dateFulfilled: Date
    fulfilled: Boolean @default(value: false)
    planId: String!
    rank: Int
    shopifyOrderId: BigInt
    shopifyProductId: BigInt!
    shopifyProductVariantId: BigInt!
  }
  
  type Referral {
    referrer: String!
    referred: String!
  }
  
  type ReferralsResponse {
    referrals: [Referral!]!
  }
  
  type CustomersResponse {
    customers: [Customer!]!
  }
  
  scalar JSON
  
  scalar Date
  
  scalar BigInt
  
  directive @default(function: String, value: JSON) on FIELD_DEFINITION
  
  directive @extends(type: String!) on OBJECT
  
  enum LambdaMethod {
    GET
    POST
    PUT
    DELETE
  }
  
  directive @lambda(method: LambdaMethod) on FIELD_DEFINITION
  
  schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
  }
  `)
  toMacthLines(
    fragments.get('QueueResponse') as string,
    `fragment QueueResponseFragment on QueueResponse {
    queue {
      ...OrderFragment 
    }
    __typename
  }
  fragment OrderFragment on Order {
    cid
    dateCreated
    dateFulfilled
    fulfilled
    planId
    rank
    shopifyOrderId
    shopifyProductId
    shopifyProductVariantId
    __typename
  }
`
  )
})

test('bug 44', () => {
  const fragments = buildFragments(`
  type Query {
    browserqlQuery: ID
    
    getProjectHours(project: ID!): Int!
    
    firestore_paginate_Project(where: [FirestoreWhere], filters: FirestoreFilters): [Project!]!
    
    firestore_getOne_Project(where: [FirestoreWhere], filters: FirestoreFilters): Project
    
    firestore_getById_Project(id: ID!): Project
    
    firestore_paginate_Page(where: [FirestoreWhere], filters: FirestoreFilters): [Page!]!
    
    firestore_getOne_Page(where: [FirestoreWhere], filters: FirestoreFilters): Page
    
    firestore_getById_Page(id: ID!): Page
    
    firestore_paginate_ProjectIntegration(where: [FirestoreWhere], filters: FirestoreFilters): [ProjectIntegration!]!
    
    firestore_getOne_ProjectIntegration(where: [FirestoreWhere], filters: FirestoreFilters): ProjectIntegration
    
    firestore_getById_ProjectIntegration(id: ID!): ProjectIntegration

    firestore_paginate_Integration(where: [FirestoreWhere], filters: FirestoreFilters): [Integration!]!
    
    firestore_getOne_Integration(where: [FirestoreWhere], filters: FirestoreFilters): Integration
    
    firestore_getById_Integration(id: ID!): Integration
  }
  
  type Mutation {
    browserqlMutation: ID
  }
  
  scalar JSON
  
  directive @firestore(collection: String) on OBJECT
  
  directive @firestore_ref on FIELD_DEFINITION
  
  enum FirestoreWhereOperator {
    equals
  }
  
  input FirestoreFilters {
    page: Int
    size: Int
    orderBy: String
  }
  
  input FirestoreWhere {
    field: String!
    operator: FirestoreWhereOperator!
    value: JSON!
  }
  
  type Project @firestore {
    name: String!
    id: ID!
  }
  
  type Page @firestore {
    name: String!
    project: ID!
    description: String!
    media: String!
    hours: Int!
    price: Int!
    id: ID!
  }
  
  type Integration @firestore {
    hours: Int!
    name: String!
    price: Int!
    subheader: String!
    media: String!
    id: ID!
  }
  
  type ProjectIntegration @firestore {
    project: ID!
    integration: Integration! @firestore_ref
    id: ID!
  }
  
  schema {
    query: Query
    mutation: Mutation
  }
  `)
})
