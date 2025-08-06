import React from 'react'
import SimpleEmailTest from '@/components/SimpleEmailTest'

const EmailTestPage: React.FC = () => {
  return (
    <div style={{ padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '30px', color: '#333' }}>Email Testing Dashboard</h1>
      
      <div style={{ marginBottom: '40px' }}>
        <h2 style={{ color: '#555', marginBottom: '20px' }}>Email Service Status</h2>
        <p style={{ color: '#666', lineHeight: '1.6' }}>
          This page allows you to test your email configurations. Make sure you have:
        </p>
        <ul style={{ color: '#666', lineHeight: '1.8', paddingLeft: '20px' }}>
          <li>Created an email configuration in the Email Settings collection</li>
          <li>Marked one configuration as "Active"</li>
          <li>Provided valid SMTP credentials</li>
        </ul>
      </div>

      <SimpleEmailTest />
      
      <div style={{ 
        marginTop: '40px', 
        padding: '20px', 
        backgroundColor: '#f0f8ff', 
        border: '1px solid #b3d9ff', 
        borderRadius: '8px' 
      }}>
        <h3 style={{ margin: '0 0 15px 0', color: '#0066cc' }}>📧 How to Set Up Email</h3>
        <ol style={{ color: '#333', lineHeight: '1.6', paddingLeft: '20px' }}>
          <li>Go to <strong>Collections → Email Settings</strong></li>
          <li>Click <strong>"Create New"</strong></li>
          <li>Fill in your SMTP details:
            <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
              <li><strong>Provider Name:</strong> A friendly name (e.g., "Gmail", "Outlook")</li>
              <li><strong>SMTP Host:</strong> Your email provider's SMTP server</li>
              <li><strong>SMTP Port:</strong> Usually 587 for TLS or 465 for SSL</li>
              <li><strong>SMTP Username:</strong> Your email address</li>
              <li><strong>SMTP Password:</strong> Your email password or app password</li>
              <li><strong>From Address:</strong> The email address to send from</li>
            </ul>
          </li>
          <li>Check <strong>"Active Configuration"</strong> to enable this config</li>
          <li>Save the configuration</li>
          <li>Return to this page and test!</li>
        </ol>
      </div>

      <div style={{ 
        marginTop: '20px', 
        padding: '15px', 
        backgroundColor: '#fff3cd', 
        border: '1px solid #ffeaa7', 
        borderRadius: '8px' 
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#856404' }}>⚠️ Common SMTP Settings</h4>
        <div style={{ fontSize: '14px', color: '#856404' }}>
          <strong>Gmail:</strong> smtp.gmail.com:587 (Use App Password)<br/>
          <strong>Outlook:</strong> smtp-mail.outlook.com:587<br/>
          <strong>Yahoo:</strong> smtp.mail.yahoo.com:587<br/>
          <strong>Custom SMTP:</strong> Check with your email provider
        </div>
      </div>
    </div>
  )
}

export default EmailTestPage