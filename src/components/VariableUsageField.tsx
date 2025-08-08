'use client'

import React from 'react'
import { useField } from '@payloadcms/ui'

interface VariableUsageFieldProps {
  path: string
}

export const VariableUsageField: React.FC<VariableUsageFieldProps> = ({ path }) => {
  // Get the name field value from the same array item
  const nameFieldPath = path.replace('.usageExample', '.name')
  const nameField = useField({ path: nameFieldPath })
  const variableName = (nameField.value as string) || 'variable_name'

  return (
    <div style={{
      padding: '12px',
      backgroundColor: '#f8f9fa',
      border: '1px solid #e1e5e9',
      borderRadius: '6px',
      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
      fontSize: '14px',
      color: '#495057',
      marginTop: '8px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        marginBottom: '8px'
      }}>
        <span style={{
          fontSize: '12px',
          fontWeight: '600',
          color: '#6c757d',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Usage in Templates:
        </span>
      </div>
      
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #dee2e6',
        borderRadius: '4px',
        padding: '8px 12px',
        fontWeight: '600',
        color: '#0d6efd'
      }}>
        {`{{${variableName}}}`}
      </div>
      
      <div style={{
        fontSize: '11px',
        color: '#6c757d',
        marginTop: '6px',
        fontStyle: 'italic'
      }}>
        Copy this exact format (no spaces between braces)
      </div>
    </div>
  )
}

export default VariableUsageField