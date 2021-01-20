const { readdir, readFile, stat, writeFile } = require('fs')
const { set, compact, mapKeys, last, upperFirst } = require('lodash')
const { join } = require('path')
const { promisify } = require('util')
const vm = require('vm');

function findLanguageByExtension(fileName) {
  const extension = last(fileName.split(/\./))
  switch (extension) {
    case 'js':
      return 'javascript'
  }
}

function runScript(file, ctx) {
  const extension = last(file.name.split(/\./))
  switch (extension) {
    case 'js':
      return `\`\`\`component
${JSON.stringify(
  {
    component: './Code',
    props: {
      language: 'json',
      value: JSON.stringify(file.output, null, 2)
    },
  },
  null,
  2
)}
\`\`\``
  }
}

function transform(source, ctx) {
  let src = source
  ctx.files.forEach((file) => {
    const SHOW = `\{\{ show ${file.name} \}\}`
    const RUN = `\{\{ run ${file.name} \}\}`

    src = src.replace(new RegExp(RUN, 'g'), runScript(file, ctx))

    src = src.replace(
      new RegExp(SHOW, 'g'),
      `\`\`\`${findLanguageByExtension(file.name)}
${file.source}
\`\`\``
    )
  })
  return src
}

async function tree(dir) {
  const repTree = {}
  const files = await promisify(readdir)(dir)
  await Promise.all(
    files.map(async (file) => {
      const x = await promisify(stat)(join(dir, file))
      if (x.isDirectory()) {
        repTree[file] = await tree(join(dir, file))
      } else {
        repTree[file] = 1
      }
    })
  )
  return repTree
}

async function fillTree(repTree, path = '') {
  const examples = []

  const promises = []

  mapKeys(repTree, (_a, moduleKey) => {
    mapKeys(repTree[moduleKey], (value, exampleKey) => {
      const promise = async () => {
        const index = await promisify(readFile)(
          join('packages/examples/modules', moduleKey, exampleKey, 'index.md')
        )
        const files = []
        const filePromises = []
        mapKeys(value.files, (file, fileName) => {
          filePromises.push(async () => {
            const source = await promisify(readFile)(
              join(
                'packages/examples/modules',
                moduleKey,
                exampleKey,
                'files',
                fileName
              )
            )
            
            const contextobj = { ____: { example: undefined } } 
              
            vm.createContext(contextobj); 
              
            let result = vm.runInNewContext(source.toString(), contextobj);

            const nextSource = source.toString().trim().split('\n')

            nextSource.pop()
            nextSource.pop()
              
            files.push({ name: fileName, source: nextSource.join('\n').toString(), output: contextobj.____.example })
          })
        })
        await Promise.all(filePromises.map((p) => p()))
        examples.push({
          module: moduleKey,
          name: exampleKey,
          index: index.toString(),
          files,
          bundle: transform(index.toString(), {
            module: moduleKey,
            name: exampleKey,
            files,
          }),
        })
      }
      promises.push(promise())
    })
  })

  await Promise.all(promises)

  return examples
}

async function run() {
  const repTree = await tree('packages/examples/modules')
  const examples = await fillTree(repTree)
  // console.log(JSON.stringify(examples, null, 2))
  console.log(examples[0].bundle)
  await Promise.all(
    examples.map(async (example) => {
      await promisify(writeFile)(
        join(
          'packages/examples/modules',
          example.module,
          example.name,
          'bundle.md'
        ),
        example.bundle
      )
    })
  )
  await promisify(writeFile)(
    'packages/examples/examples.json',
    JSON.stringify(
      examples.map((example) => ({
        module: example.module,
        name: example.name,
        bundle: example.bundle,
      })),
      null,
      2
    ).concat('\n')
  )
}

run()
