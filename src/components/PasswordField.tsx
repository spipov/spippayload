'use client'

import React, { useState } from 'react'

interface PasswordFieldProps {
  path: string
  value?: string
  onChange: (value: string) => void
  label?: string
  required?: boolean
  placeholder?: string
  description?: string
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  path,
  value = '',
  onChange,
  label,
  required,
  placeholder,
  description,
}) => {
  const [showPassword, setShowPassword] = useState(false)
  const [inputValue, setInputValue] = useState(value)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInputValue(newValue)
    onChange(newValue)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  return (
    <div className="field-type password-field">
      {label && (
        <label className="field-label" htmlFor={path}>
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <input
          id={path}
          name={path}
          type={showPassword ? 'text' : 'password'}
          value={inputValue}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          style={{
            width: '100%',
            padding: '8px 40px 8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            fontSize: '14px',
            backgroundColor: '#fff'
          }}
        />
        
        <button
          type="button"
          onClick={togglePasswordVisibility}
          style={{
            position: 'absolute',
            right: '8px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px',
            color: '#6b7280',
            fontSize: '14px'
          }}
          title={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? '👁️' : '👁️‍🗨️'}
        </button>
      </div>
      
      {description && (
        <div className="field-description" style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
          {description}
        </div>
      )}
    </div>
  )
}

export default PasswordField