import React, { ReactElement } from 'react'

interface Props {
  children: ReactElement
  codesandbox?: string
}

export default function Story(props: Props) {
  const { children, codesandbox } = props
  console.log({ children })
  return (
    <>
      <div>{children}</div>
      {codesandbox && (
        <iframe
          src={`https://codesandbox.io/embed/${codesandbox}?fontsize=14&hidenavigation=1&theme=dark`}
          style={{
            width: '100%',
            height: 500,
            border: 0,
            borderRadius: 4,
            overflow: 'hidden',
          }}
          title="jolly-https-zfjuw"
          allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
          sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
        ></iframe>
      )}
    </>
  )
}
