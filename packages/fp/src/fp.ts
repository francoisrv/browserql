type FP = (input: any) => any
type FPE = (error: Error, input: any) => any

type LP<A extends FP[]> = ReturnType<A[-1]>

export default function fp(value?: any): (
  (...fns: Array<FP|[FP, FPE]>) => any
) {
  return function(...fns) {
    let io = value
    fns.forEach(fn => {
      if (typeof fn === 'function') {
        io = fn(io)
      } else if (Array.isArray(fn)) {
        const [fn1, catcher] = fn
        try {
          io = fn1(io)
        } catch (error) {
          io = catcher(error, io)
        }
      }
    })
    return io
  }
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
