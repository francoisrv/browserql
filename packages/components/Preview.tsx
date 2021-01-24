import React from 'react'

interface Data {
  ctx: {
    module: string
    name: string
  }
  file: {
    name: string
  }
}

export default function Preview({ data }: { data: Data }) {
  return (
    <iframe
      src={`/preview/${data.ctx.module}/${
        data.ctx.name
      }/${data.file.name.replace(/\.tsx$/, '')}`}
      style={{
        border: 'none',
        width: '100%',
        backgroundColor: 'white',
      }}
    ></iframe>
  )
}
