type FP = (input: any) => any
type FPE = (error: Error, input: any) => any

export default function fp(value?: any) {
  return (...fns: ((i: any) => any)[]) =>
    fns.reduce((io, fn) => {
      return fn(io)
    }, value)
}

fp.promise = (value?: any) => {
  return async <A = unknown>(...fns: Array<FP | [FP, FPE]>): Promise<A> => {
    let io = value
    for (const fn of fns) {
      if (typeof fn === 'function') {
        io = await fn(io)
      } else if (Array.isArray(fn)) {
        const [fn1, catcher] = fn
        try {
          io = await fn1(io)
        } catch (error) {
          io = await catcher(error, io)
        }
      }
    }
    return io
  }
}
