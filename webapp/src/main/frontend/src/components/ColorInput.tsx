import React from 'react'
import { useInput, useRecordContext, Validator } from 'ra-core'
import { TextInput } from 'react-admin';
import { useState } from 'react'
import * as ReactColor from 'react-color'
import './css/ColorInput.css'

interface ColorFieldProps {
  source: string
  // eslint-disable-next-line react/no-unused-prop-types
  label?: string
  className?: string
}

export const ColorField = ({ source }: ColorFieldProps) => {
  const record = useRecordContext()

  return (
    <div style={{ display: 'flex' }}>
      <div
        style={{
          width: '20px',
          height: '20px',
          background: record[source],
          marginRight: '5px',
        }}
      />
    </div>
  )
}

interface ColorInputProps {
  label?: string
  fullWidth?: boolean
  options?: {
    disableAlpha: true
  }
  source: string
  isRequired?: boolean
  validate?: Validator | Validator[] | undefined
  picker?:
    | 'Alpha'
    | 'Block'
    | 'Check'
    | 'Chrome'
    | 'Circle'
    | 'Compact'
    | 'Github'
    | 'Hue'
    | 'Material'
    | 'Photoshop'
    | 'Sketch'
    | 'Slider'
    | 'Swatches'
    | 'Twitter'
    | 'Custom'
}

export const ColorInput = (props: ColorInputProps) => {
  const [show, setShow] = useState(false)

  const {
    label,
    source,
    fullWidth,
    options,
    picker = 'Chrome',
    validate,
  } = props

  const {
    field,
    fieldState: { isTouched, error },
    isRequired,
  } = useInput({
    ...props,
    validate,
  })

  const handleOpen = () => setShow(true)
  const handleClose = () => setShow(false)
  const handleChange = ({ hex }: any) => {
    field.onChange(hex)
  }

  const Picker = ReactColor[`${picker}Picker` as keyof typeof ReactColor]

  return (
    <div style={{ display: 'flex' }}>
      <TextInput
        {...field}
        fullWidth={fullWidth}
        source={source}
        onFocus={handleOpen}
        isRequired={isRequired}
        label={label}
        error={!!(isTouched && error)}
      />
      {show ? (
        <div className="ColorInput-popup">
          {/* eslint-disable-next-line */}
          <div className="ColorInput-cover" onClick={handleClose} />
          {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
          {/* @ts-ignore */}
          <Picker {...options} color={field.value} onChange={handleChange} />
        </div>
      ) : null}
      <div
        style={{
          width: '20px',
          height: '40px',
          background: field.value ? field.value : "#FFFFFF",
          border: "1px solid #bbb",
          marginRight: '5px',
          marginLeft: '-1px'
        }}
      />
    </div>
  )
}