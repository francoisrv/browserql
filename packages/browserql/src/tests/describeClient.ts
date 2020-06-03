import Client from '../Client'
import { ConnectOptions } from '../types'
import connect from '../connect'

export default function describeClient(
  label: string,
  connectOptions: ConnectOptions,
  ...its: [string, (client: Client) => void | Promise<void>][]
) {
  describe(label, () => {
    let client: Client
    beforeAll(() => {
      client = connect(connectOptions)
    })
    for (const [itLabel, handler] of its) {
      it(itLabel, async () => {
        await handler(client)
      })
    }
  })
}
