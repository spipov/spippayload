'use client'

import React, { useState } from 'react'

const SimpleEmailTest: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')

  const handleTestEmail = async () => {
    setIsLoading(true)
    setMessage('')
    setMessageType('')

    try {
      const response = await fetch('/api/test-email-simple', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (result.success) {
        setMessage('✅ Test email sent successfully!')
        setMessageType('success')
      } else {
        setMessage(`❌ Error: ${result.error}`)
        setMessageType('error')
      }
    } catch (error) {
      setMessage(`❌ Network error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`)
      setMessageType('error')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px', margin: '20px 0' }}>
      <h3>Simple Email Test (Payload Built-in)</h3>
      <p>Test the built-in Payload email system with hardcoded SMTP settings.</p>
      
      <button 
        type="button"
        onClick={handleTestEmail}
        disabled={isLoading}
        style={{ 
          padding: '10px 20px', 
          backgroundColor: isLoading ? '#ccc' : '#007cba', 
          color: 'white', 
          border: 'none', 
          borderRadius: '4px', 
          cursor: isLoading ? 'not-allowed' : 'pointer', 
          fontSize: '14px', 
        }} 
      > 
        {isLoading ? 'Sending...' : 'Send Test Email'} 
      </button> 

      {message && (
        <div 
          style={{ 
            marginTop: '10px', 
            padding: '10px', 
            borderRadius: '4px', 
            backgroundColor: messageType === 'success' ? '#d4edda' : '#f8d7da', 
            color: messageType === 'success' ? '#155724' : '#721c24', 
            border: `1px solid ${messageType === 'success' ? '#c3e6cb' : '#f5c6cb'}`, 
          }} 
        > 
          {message} 
        </div> 
      )} 
    </div> 
  ) 
} 

export default SimpleEmailTest