'use client'

import React, { useState } from 'react'

interface TestEmailComponentProps {
  id?: string
  data?: any
}

export const TestEmailComponent: React.FC<TestEmailComponentProps> = ({ id, data }) => {
  const documentId = id || data?.id
  const [testEmail, setTestEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  if (!documentId) {
    return (
      <div style={{ padding: '16px', backgroundColor: '#f9fafb', border: '1px solid #e1e5e9', borderRadius: '4px' }}>
        <p style={{ margin: 0, color: '#666' }}>Save this email configuration first to enable testing.</p>
      </div>
    )
  }

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  const handleSendTestEmail = async () => {
    if (!testEmail) {
      showMessage('error', 'Please enter an email address')
      return
    }

    if (!testEmail.includes('@')) {
      showMessage('error', 'Please enter a valid email address')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch(`/api/email-settings/${documentId}/test-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ testEmail }),
      })

      const result = await response.json()

      if (response.ok) {
        showMessage('success', `Test email sent successfully to ${testEmail}`)
        setTestEmail('')
      } else {
        showMessage('error', result.error || 'Failed to send test email')
      }
    } catch (error) {
      console.error('Error sending test email:', error)
      showMessage('error', 'Failed to send test email')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div style={{ 
      padding: '16px', 
      backgroundColor: '#f9fafb', 
      border: '1px solid #e1e5e9', 
      borderRadius: '4px',
      marginTop: '16px'
    }}>
      <h4 style={{ margin: '0 0 12px 0', color: '#333', fontSize: '14px', fontWeight: '600' }}>
        Test Email Configuration
      </h4>
      <p style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#666' }}>
        Send a test email to verify this configuration works correctly.
      </p>
      
      <div style={{ marginBottom: '12px' }}>
        <label 
          htmlFor="test-email-input"
          style={{ 
            display: 'block', 
            marginBottom: '6px', 
            fontSize: '13px', 
            fontWeight: '500',
            color: '#374151'
          }}
        >
          Email address to send to:
        </label>
        <input
          id="test-email-input"
          type="email"
          value={testEmail}
          onChange={(e) => setTestEmail(e.target.value)}
          placeholder="test@example.com"
          style={{
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            fontSize: '14px',
            backgroundColor: '#fff'
          }}
          disabled={isLoading}
        />
      </div>
      
      <button
        type="button"
        onClick={handleSendTestEmail}
        disabled={isLoading || !testEmail}
        style={{
          backgroundColor: isLoading ? '#9ca3af' : '#3b82f6',
          color: '#fff',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          fontSize: '13px',
          cursor: isLoading ? 'not-allowed' : 'pointer'
        }}
      >
        {isLoading ? 'Sending...' : 'Send Test Email'}
      </button>
      
      {message && (
        <div style={{
          marginTop: '12px',
          padding: '8px 12px',
          borderRadius: '4px',
          fontSize: '13px',
          backgroundColor: message.type === 'success' ? '#d1fae5' : '#fee2e2',
          color: message.type === 'success' ? '#065f46' : '#991b1b',
          border: `1px solid ${message.type === 'success' ? '#a7f3d0' : '#fecaca'}`
        }}>
          {message.text}
        </div>
      )}
    </div>
  )
}

export default TestEmailComponent