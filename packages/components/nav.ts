import examples from '@browserql/examples/examples.json'

const nav: Record<string, Record<string, typeof examples>> = {
  Utils: {
    FPQL: examples.filter((example) => example.module === 'fpql'),
  },
}

export default nav
