'use client'

import React, { useState } from 'react'

interface EmailTestButtonProps {
  value?: any
  onChange?: (value: any) => void
  path?: string
  label?: string
}

const EmailTestButton: React.FC<EmailTestButtonProps> = ({ value, onChange, path, label }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState<'success' | 'error' | ''>('')
  const [testEmail, setTestEmail] = useState('')

  // Extract the document ID from the path or value
  const getDocumentId = () => {
    if (typeof window !== 'undefined') {
      const pathSegments = window.location.pathname.split('/')
      const idIndex = pathSegments.findIndex(segment => segment === 'email-settings') + 1
      return pathSegments[idIndex] || null
    }
    return null
  }

  const handleTestEmail = async () => {
    if (!testEmail) {
      setMessage('Please enter a test email address')
      setMessageType('error')
      return
    }

    const configId = getDocumentId()
    if (!configId) {
      setMessage('Unable to determine configuration ID. Please save the configuration first.')
      setMessageType('error')
      return
    }

    setIsLoading(true)
    setMessage('')
    setMessageType('')

    try {
      const response = await fetch('/api/test-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          configId,
          testEmail
        })
      })

      const result = await response.json()

      if (result.success) {
        setMessage(`✅ ${result.message}`)
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
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px', 
      margin: '20px 0',
      backgroundColor: '#f9f9f9'
    }}>
      <h3 style={{ margin: '0 0 15px 0', color: '#333' }}>Test Email Configuration</h3>
      <p style={{ margin: '0 0 15px 0', color: '#666', fontSize: '14px' }}>
        Send a test email to verify this configuration is working correctly.
      </p>
      
      <div style={{ marginBottom: '15px' }}>
         <label 
           htmlFor="test-email-input"
           style={{ 
             display: 'block', 
             marginBottom: '5px', 
             fontWeight: 'bold',
             fontSize: '14px'
           }}
         >
           Test Email Address:
         </label>
         <input
           id="test-email-input"
           type="email"
           value={testEmail}
           onChange={(e) => setTestEmail(e.target.value)}
           placeholder="Enter email address to send test to"
           style={{
             width: '100%',
             padding: '8px 12px',
             border: '1px solid #ccc',
             borderRadius: '4px',
             fontSize: '14px',
             boxSizing: 'border-box'
           }}
         />
       </div>
       
       <button 
         type="button"
         onClick={handleTestEmail}
         disabled={isLoading || !testEmail}
         style={{ 
           padding: '10px 20px', 
           backgroundColor: isLoading || !testEmail ? '#ccc' : '#007cba', 
           color: 'white', 
           border: 'none', 
           borderRadius: '4px', 
           cursor: isLoading || !testEmail ? 'not-allowed' : 'pointer', 
           fontSize: '14px',
           fontWeight: 'bold'
         }} 
       > 
         {isLoading ? 'Sending Test Email...' : 'Send Test Email'} 
       </button> 

      {message && (
        <div
          style={{
            marginTop: '15px',
            padding: '12px',
            borderRadius: '4px',
            backgroundColor: messageType === 'success' ? '#d4edda' : '#f8d7da',
            color: messageType === 'success' ? '#155724' : '#721c24',
            border: `1px solid ${messageType === 'success' ? '#c3e6cb' : '#f5c6cb'}`,
            fontSize: '14px'
          }}
        >
          {message}
        </div>
      )}
    </div>
  )
}

export default EmailTestButton