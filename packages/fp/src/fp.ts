type FP = (input: any) => any
type FPE = (error: Error, input: any) => any

export default function fp<D = any, V = any>(value?: V, c?: (e: Error) => D): (F1: ((v: V) => any) | [(v: V) => any, FPE], ...F: (FP|[FP, FPE])[]) => D {
  // @ts-ignore
  return (...fns) => fns.reduce(
    (io, fn) => {
      if (typeof fn === 'function') {
        // @ts-ignore
        return fn(io)
      }
      const [tryer, catcher] = fn
      try {
        // @ts-ignore
        return tryer(io)
      } catch (error) {
        return catcher(error, io)
      }
    },
    value
  ) as D
}

fp.promise = (value?: any) => {
  return async <A = unknown>(...fns: Array<FP|[FP, FPE]>): Promise<A> => {
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
