interface GetState {
  state: string
}

export function getState(params: GetState) {
  return `hello ${ params.state }`
}