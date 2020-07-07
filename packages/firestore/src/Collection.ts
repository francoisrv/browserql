import { Client } from "@browserql/client"
import { Dictionary } from "lodash"
import { buildDocuments } from "./utils"

export default class Collection {
  reference: any
  client: Client
  single = false
  name: string
  collectionName: string

  constructor(name: string, db: any, client: Client) {
    this.name = name
    this.collectionName = this.getName(name)
    this.client = client
    this.reference = db.collection(this.collectionName)
  }

  getName(name: string) {
    let nextName = name.toLowerCase()
    if (/y$/.test(nextName)) {
      nextName = nextName.replace(/y$/, 'ies')
    } else {
      nextName += 's'
    }
    return nextName
  }

  doc(id: string): this {
    this.reference = this.reference.doc(id)
    this.single = true
    return this
  }

  where(field: string, operator: string, value: any): this {
    this.reference = this.reference.where(field, operator, value)
    return this
  }

  orderBy(field: string): this {
    this.reference = this.reference.orderBy(field)
    return this
  }

  startsAt(index: number): this {
    this.reference = this.reference.startsAt(index)
    return this
  }

  endsAt(index: number): this {
    this.reference = this.reference.endsAt(index)
    return this
  }

  limit(index: number): this {
    this.reference = this.reference.limit(index)
    return this
  }

  onSnapshot(cb: Function): this {
    this.reference = this.reference.onSnapshot(cb)
    return this
  }

  async get() {
    const querySnapshot = await this.reference.get()
    console.log(buildDocuments(querySnapshot, this.name))
  }

  async set(document: Dictionary<any>) {
    await this.reference.set(document)
  }

  async add(document: Dictionary<any>) {
    const docRef = await this.reference.add(document)
    console.log({docRef})
  }
}
