globalThis.fetchResponse = null

globalThis.fetch = async (url: string) => {
  return {
    async json() {
      return globalThis.fetchResponse
    },
  }
}
