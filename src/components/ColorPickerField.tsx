'use client'

import React, { useState, useEffect } from 'react'
import { useField, FieldLabel, FieldError } from '@payloadcms/ui'
import type { TextFieldClientProps } from 'payload'

interface ColorPickerFieldProps extends TextFieldClientProps {
  path: string
  field: any
  validate?: any
}

export const ColorPickerField: React.FC<ColorPickerFieldProps> = (props) => {
  const { path, field, validate } = props
  const { value, setValue, showError, errorMessage } = useField<string>({
    path,
    validate,
  })

  const [localValue, setLocalValue] = useState(value || field.defaultValue || '#000000')
  const [isValidHex, setIsValidHex] = useState(true)

  // Validate hex color
  const validateHexColor = (color: string): boolean => {
    return /^#[0-9A-F]{6}$/i.test(color)
  }

  // Update local value when prop value changes
  useEffect(() => {
    if (value !== localValue) {
      setLocalValue(value || field.defaultValue || '#000000')
    }
  }, [value, field.defaultValue, localValue])

  // Handle color picker change
  const handleColorChange = (newColor: string) => {
    setLocalValue(newColor)
    setIsValidHex(validateHexColor(newColor))
    setValue(newColor)
  }

  // Handle text input change
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setLocalValue(newValue)
    const isValid = validateHexColor(newValue)
    setIsValidHex(isValid)
    if (isValid) {
      setValue(newValue)
    }
  }



  return (
    <div className="field-type color-picker-field">
      <FieldLabel
        htmlFor={path}
        label={field.label}
        required={field.required}
      />
      
      <div className="color-picker-container" style={{ marginTop: '8px' }}>
        {/* Color Preview and Picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
          <div
            style={{
              width: '60px',
              height: '40px',
              borderRadius: '6px',
              backgroundColor: isValidHex ? localValue : '#cccccc',
              border: '2px solid #e1e5e9',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <input
              type="color"
              value={isValidHex ? localValue : '#000000'}
              onChange={(e) => handleColorChange(e.target.value)}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                cursor: 'pointer',
              }}
            />
          </div>
          
          <input
            type="text"
            value={localValue}
            onChange={handleTextChange}
            placeholder="#000000"
            style={{
              padding: '8px 12px',
              border: `1px solid ${isValidHex ? '#e1e5e9' : '#ff6b6b'}`,
              borderRadius: '4px',
              fontSize: '14px',
              fontFamily: 'monospace',
              width: '100px',
              backgroundColor: isValidHex ? 'white' : '#fff5f5',
            }}
          />
          
          {!isValidHex && (
            <span style={{ color: '#ff6b6b', fontSize: '12px' }}>
              Invalid hex color
            </span>
          )}
        </div>


      </div>

      <FieldError showError={showError} message={errorMessage} />
    </div>
  )
}

export default ColorPickerField