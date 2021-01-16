const { readdir, readFile, stat } = require('fs')
const { set, compact, mapKeys, last } = require('lodash')
const { join } = require('path')
const { promisify } = require('util')

function findLanguageByExtension(fileName) {
  const extension = last(fileName.split(/\./))
  switch (extension) {
    case 'js': return 'javascript'
  }
}

function runScript(file, ctx) {
  const extension = last(file.name.split(/\./))
  switch (extension) {
    case 'js': return `
\`\`\`component
{
  "component": "@browserql/components/Code",
  "props": {
    "value": "GOO",
    "language": "json"
  }
}
\`\`\`
`
  }
}

function transform(source, ctx) {
  let src = source
  ctx.files.forEach(file => {
    const SHOW = `\{\{ show ${file.name} \}\}`
    const RUN = `\{\{ run ${file.name} \}\}`

    src = src.replace(
      new RegExp(RUN, 'g'),
      runScript(file, ctx)
    )

    src = src.replace(
      new RegExp(SHOW, 'g'),
      `
\`\`\`${findLanguageByExtension(file.name)}
${file.source}
\`\`\`
`
    )
  })
  return src
}

async function tree(dir) {
  const repTree = {}
  const files = await promisify(readdir)(dir)
  await Promise.all(
    files.map(async file => {
      const x = await promisify(stat)(
        join(dir, file)
      )
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
          join('examples', moduleKey, exampleKey, 'index.md')
        )
        const files = []
        const filePromises = []
        mapKeys(value.files, (file, fileName) => {
          filePromises.push(async () => {
            const source = await promisify(readFile)(
              join('examples', moduleKey, exampleKey, 'files', fileName)
            )
            files.push({ name: fileName, source: source.toString() })
          })
        })
        await Promise.all(filePromises.map(p => p()))
        examples.push({
          module: moduleKey,
          name: exampleKey,
          index: index.toString(),
          files,
          bundle: transform(
            index.toString(),
            {
              module: moduleKey,
              name: exampleKey,
              files
            }
          )
        })
      }
      promises.push(promise())
    })
  })

  await Promise.all(promises)

  return examples
}

async function run() {
  const repTree = await tree('examples')
  const examples = await fillTree(repTree)
  console.log(JSON.stringify(examples, null, 2))
  console.log()
  console.log(examples[0].bundle)
}

run()