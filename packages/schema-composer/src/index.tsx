import { DocumentNode, parse, print } from 'graphql'
import React, { useCallback, useEffect, useState } from 'react'

interface Props {
  schema: DocumentNode | string
  onChange(source: string, schema: DocumentNode): void
}

export default function SchemaComposer({ schema, onChange }: Props) {
  const source = typeof schema === 'string' ? schema : print(schema)
  const [value, setValue] = useState(source)
  const [isValid, setIsValid] = useState(true)
  const [validityError, setValidityError] = useState<{
    message: string
    locations: { column: number; line: number }[]
  } | null>(null)
  const [isDarkMode, setIsdarkMode] = useState(true)

  const toggleDarkMode = useCallback(() => setIsdarkMode(!isDarkMode), [
    isDarkMode,
  ])

  useEffect(() => {
    setValidityError(null)
    try {
      const nextSchema = parse(value)
      onChange(value, nextSchema)
      setIsValid(true)
    } catch (error) {
      setValidityError(error)
      setIsValid(false)
    }
  }, [value])

  const lines = value.trim().split(/\n/)

  return (
    <div>
      <div>
        <button onClick={toggleDarkMode} disabled={!isDarkMode}>
          Day
        </button>
        <button onClick={toggleDarkMode} disabled={isDarkMode}>
          Night
        </button>
      </div>
      <div style={{ display: 'flex' }}>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            paddingTop: 6,
            width: 30,
            alignItems: 'center',
            gap: 0,
          }}
        >
          {lines.map((line, index) => (
            <span
              key={index}
              style={{
                fontSize: 14,
                // height: 15,
                paddingBottom: -4,
                backgroundColor:
                  validityError && validityError.locations[0].line === index + 1
                    ? 'red'
                    : 'inherit',
              }}
            >
              {index + 1}
            </span>
          ))}
        </div>
        <textarea
          value={value}
          onChange={(event) => setValue(event.target.value)}
          rows={source.split(/\n/).length}
          style={{
            color: isDarkMode ? '#fff' : '#000',
            backgroundColor: isDarkMode ? '#000' : '#eee',
            width: '100%',
            boxSizing: 'border-box',
            padding: 8,
            lineHeight: '1.5em',
          }}
        />
      </div>
      <div>
        <input type="checkbox" checked={isValid} disabled />
        {isValid && <label>DST is valid 🎉</label>}
        {!isValid && <label>DST is invalid ⛔</label>}
        {!isValid && validityError && (
          <div style={{ color: 'red' }}>
            <div>{validityError.message}</div>
            <div style={{ color: 'orange' }}>
              {validityError.locations[0].line}:
              {validityError.locations[0].column}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
