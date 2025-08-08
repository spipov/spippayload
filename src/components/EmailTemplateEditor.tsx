'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useField } from '@payloadcms/ui'
import { generateSystemVariableSampleData } from '@/lib/systemVariables'

interface EmailTemplateEditorProps {
  path: string
}

export const EmailTemplateEditor: React.FC<EmailTemplateEditorProps> = ({ path }) => {
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('edit')
  const [selectedSection, setSelectedSection] = useState<'subject' | 'preheader' | 'content'>('content')

  // Get form fields - fix path references to match the actual field names
  const subjectField = useField({ path: 'subject' })
  const preheaderField = useField({ path: 'preheader' })
  const htmlContentField = useField({ path: 'htmlContent' })
  const textContentField = useField({ path: 'textContent' })
  const variablesField = useField({ path: 'variables' })
  const testDataField = useField({ path: 'testData' })

  const currentValues = {
    subject: subjectField.value || '',
    preheader: preheaderField.value || '',
    htmlContent: htmlContentField.value || '',
    textContent: textContentField.value || '',
    variables: variablesField.value || [],
    testData: testDataField.value || {},
  }

  // State for preview HTML to trigger re-renders
  const [previewHtml, setPreviewHtml] = useState<string>('')
  const [typography, setTypography] = useState<any>(null)

  // Use useRef for timeout to avoid dependency issues
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Sample branding for preview
  const sampleBranding = {
    appName: 'Your App Name',
    tagline: 'Welcome to our platform',
    colors: {
      primary: '#007bff',
      secondary: '#6c757d',
      accent: '#28a745',
      background: '#ffffff',
      text: '#333333',
      textLight: '#666666',
    },
    typography: {
      fontFamily: 'Arial, sans-serif',
      fontSize: '16',
      lineHeight: '1.6',
    },
  }

  // Common email templates
  const templatePresets = {
    welcome: {
      subject: 'Welcome to {{app_name}}!',
      preheader: 'Get started with your new account',
      htmlContent: `
        <h2>Welcome {{user_name}}!</h2>
        <p>Thank you for joining {{app_name}}. We're excited to have you on board!</p>
        <p>Here's what you can do next:</p>
        <ul>
          <li>Complete your profile</li>
          <li>Explore our features</li>
          <li>Connect with other users</li>
        </ul>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{{website_url}}/dashboard" class="btn">Get Started</a>
        </div>
        <p class="secondary-text">If you have any questions, feel free to reach out to our support team at {{support_email}}.</p>
      `,
    },
    passwordReset: {
      subject: 'Reset your {{app_name}} password',
      preheader: 'Click the link below to reset your password',
      htmlContent: `
        <h2>Password Reset Request</h2>
        <p>Hi {{user_name}},</p>
        <p>We received a request to reset your password for your {{app_name}} account.</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{{reset_link}}" class="btn">Reset Password</a>
        </div>
        <p class="secondary-text">This link will expire in 24 hours. If you didn't request this reset, you can safely ignore this email.</p>
        <p class="secondary-text">For security reasons, please don't share this link with anyone.</p>
      `,
    },
    notification: {
      subject: 'New notification from {{app_name}}',
      preheader: 'You have a new update',
      htmlContent: `
        <h2>You have a new notification</h2>
        <p>Hi {{user_name}},</p>
        <p>{{notification_message}}</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="{{notification_link}}" class="btn">View Details</a>
        </div>
        <p class="secondary-text">You can manage your notification preferences in your account settings.</p>
      `,
    },
  }

  const applyTemplate = (templateKey: keyof typeof templatePresets) => {
    const template = templatePresets[templateKey]

    // Update all form fields
    subjectField.setValue(template.subject)
    preheaderField.setValue(template.preheader)
    htmlContentField.setValue(template.htmlContent)

    // Force preview update after a short delay to ensure form values are updated
    setTimeout(() => {
      const html = generatePreview()
      setPreviewHtml(html)
    }, 100)
  }

  // Replace variables for preview
  const replaceVariables = (content: string) => {
    if (!content || typeof content !== 'string') return ''

    // Get system variables and merge with sample data
    const systemVariables = generateSystemVariableSampleData()
    const templateSpecificVariables = {
      '{{reset_link}}': 'https://yourapp.com/reset-password?token=sample',
      '{{verification_link}}': 'https://yourapp.com/verify?token=sample',
      '{{notification_message}}': 'You have a new message in your inbox.',
      '{{notification_link}}': 'https://yourapp.com/notifications',
      '{{order_number}}': 'ORD-12345',
      '{{invoice_url}}': 'https://yourapp.com/invoice/12345',
    }

    const variables = {
      ...systemVariables,
      ...templateSpecificVariables,
      ...(currentValues.testData && typeof currentValues.testData === 'object' ? currentValues.testData : {}),
    }

    let processedContent = String(content)
    Object.entries(variables).forEach(([variable, value]) => {
      if (typeof processedContent === 'string' && typeof value !== 'undefined') {
        processedContent = processedContent.replace(new RegExp(variable.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), String(value))
      }
    })

    return processedContent
  }

  // Generate styled preview
  const generatePreview = () => {
    try {
    const baseStyles = `
      <style>
        body {
          font-family: ${sampleBranding.typography.fontFamily};
          font-size: ${sampleBranding.typography.fontSize}px;
          line-height: ${sampleBranding.typography.lineHeight};
          color: ${sampleBranding.colors.text};
          background-color: ${sampleBranding.colors.background};
          margin: 0;
          padding: 20px;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: ${sampleBranding.colors.background};
        }
        .email-header {
          background-color: ${sampleBranding.colors.primary};
          color: white;
          padding: 30px 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .email-header h1 {
          margin: 0 0 8px 0;
          font-size: 28px;
          font-weight: bold;
        }
        .email-header p {
          margin: 0;
          opacity: 0.9;
          font-size: 16px;
        }
        .email-content {
          padding: 30px 20px;
        }
        .email-content h2 {
          color: ${sampleBranding.colors.text};
          margin: 0 0 16px 0;
          font-size: 24px;
        }
        .email-content h3 {
          color: ${sampleBranding.colors.text};
          margin: 0 0 12px 0;
          font-size: 20px;
        }
        .email-content p {
          margin: 0 0 16px 0;
          line-height: ${sampleBranding.typography.lineHeight};
        }
        .email-content .secondary-text {
          color: ${sampleBranding.colors.textLight};
        }
        .btn {
          display: inline-block;
          background-color: ${sampleBranding.colors.accent};
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 6px;
          font-weight: bold;
          margin: 20px 0;
        }
        .btn:hover {
          opacity: 0.9;
        }
        .email-footer {
          border-top: 1px solid ${sampleBranding.colors.secondary};
          padding: 20px;
          text-align: center;
          color: ${sampleBranding.colors.textLight};
          font-size: 14px;
        }
      </style>
    `

    const headerHtml = `
      <div class="email-header">
        <h1>${sampleBranding.appName}</h1>
        <p>${sampleBranding.tagline}</p>
      </div>
    `

    const footerHtml = `
      <div class="email-footer">
        <p>© ${new Date().getFullYear()} ${sampleBranding.appName}. All rights reserved.</p>
        <p>
          <a href="https://yourapp.com" style="color: ${sampleBranding.colors.primary};">Visit our website</a> | 
          <a href="mailto:support@yourapp.com" style="color: ${sampleBranding.colors.primary};">Contact Support</a>
        </p>
      </div>
    `

    const processedContent = replaceVariables(currentValues.htmlContent)
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${replaceVariables(currentValues.subject)}</title>
        ${baseStyles}
      </head>
      <body>
        <div class="email-container">
          ${headerHtml}
          <div class="email-content">
            ${processedContent}
          </div>
          ${footerHtml}
        </div>
      </body>
      </html>
    `
    } catch (error) {
      console.error('Error generating email preview:', error)
      return '<div style="color: red; padding: 20px; text-align: center;">Error generating preview</div>'
    }
  }

  // Debounced preview update function
  const updatePreview = useCallback(() => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current)
    }

    updateTimeoutRef.current = setTimeout(() => {
      const html = generatePreview()
      setPreviewHtml(html)
    }, 300) // 300ms debounce
  }, []) // Empty dependency array since generatePreview uses only stable values

  // Update preview when form values change
  useEffect(() => {
    updatePreview()

    // Cleanup timeout on unmount
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current)
      }
    }
  }, [
    currentValues.subject,
    currentValues.preheader,
    currentValues.htmlContent,
    currentValues.textContent,
    currentValues.testData,
    currentValues.variables,
    typography,
    updatePreview
  ])

  // Initial preview generation
  useEffect(() => {
    const html = generatePreview()
    setPreviewHtml(html)
  }, [])

  return (
    <div style={{ marginTop: '20px' }}>
      {/* Header Controls */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
        padding: '16px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        border: '1px solid #e1e5e9'
      }}>
        <div>
          <h4 style={{ margin: '0 0 8px 0', fontSize: '16px', fontWeight: '600' }}>
            Email Template Editor
          </h4>
          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
            Edit your email template with live preview
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Template Presets */}
          <select
            onChange={(e) => {
              if (e.target.value) {
                applyTemplate(e.target.value as keyof typeof templatePresets)
                e.target.value = ''
              }
            }}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              minWidth: '150px'
            }}
          >
            <option value="">Load Template...</option>
            <option value="welcome">Welcome Email</option>
            <option value="passwordReset">Password Reset</option>
            <option value="notification">Notification</option>
          </select>

          {/* Mode Toggle */}
          <div style={{ display: 'flex', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
            <button
              type="button"
              onClick={() => setPreviewMode('edit')}
              style={{
                padding: '8px 12px',
                border: 'none',
                backgroundColor: previewMode === 'edit' ? sampleBranding.colors.primary : 'white',
                color: previewMode === 'edit' ? 'white' : '#666',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode('preview')}
              style={{
                padding: '8px 12px',
                border: 'none',
                backgroundColor: previewMode === 'preview' ? sampleBranding.colors.primary : 'white',
                color: previewMode === 'preview' ? 'white' : '#666',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Preview
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div style={{ display: 'flex', gap: '16px', minHeight: '500px' }}>
        {/* Editor Panel */}
        {previewMode === 'edit' && (
          <div style={{ flex: 1, border: '1px solid #e1e5e9', borderRadius: '8px', overflow: 'hidden' }}>
            {/* Section Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e1e5e9', backgroundColor: '#f8f9fa' }}>
              {[
                { key: 'subject', label: 'Subject' },
                { key: 'preheader', label: 'Preheader' },
                { key: 'content', label: 'Content' },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setSelectedSection(key as any)}
                  style={{
                    padding: '12px 16px',
                    border: 'none',
                    backgroundColor: selectedSection === key ? 'white' : 'transparent',
                    borderBottom: selectedSection === key ? '2px solid ' + sampleBranding.colors.primary : '2px solid transparent',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: selectedSection === key ? '600' : 'normal',
                    color: selectedSection === key ? sampleBranding.colors.primary : '#666'
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Editor Content */}
            <div style={{ padding: '20px' }}>
              {selectedSection === 'subject' && (
                <div>
                  <label htmlFor="email-subject" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                    Email Subject Line
                  </label>
                  <input
                    id="email-subject"
                    type="text"
                    value={currentValues.subject}
                    onChange={(e) => {
                      subjectField.setValue(e.target.value)
                    }}
                    placeholder="Enter email subject..."
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '16px',
                      fontFamily: 'inherit'
                    }}
                  />
                  <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                    Preview: {replaceVariables(currentValues.subject)}
                  </p>
                </div>
              )}

              {selectedSection === 'preheader' && (
                <div>
                  <label htmlFor="email-preheader" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                    Preheader Text
                  </label>
                  <input
                    id="email-preheader"
                    type="text"
                    value={currentValues.preheader}
                    onChange={(e) => {
                      preheaderField.setValue(e.target.value)
                    }}
                    placeholder="Enter preheader text..."
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '16px',
                      fontFamily: 'inherit'
                    }}
                  />
                  <p style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                    This appears as preview text in email clients. Preview: {replaceVariables(currentValues.preheader)}
                  </p>
                </div>
              )}

              {selectedSection === 'content' && (
                <div>
                  <label htmlFor="email-html-content" style={{ display: 'block', marginBottom: '8px', fontWeight: '600', fontSize: '14px' }}>
                    Email Content (HTML)
                  </label>
                  <textarea
                    id="email-html-content"
                    value={currentValues.htmlContent}
                    onChange={(e) => {
                      htmlContentField.setValue(e.target.value)
                    }}
                    placeholder="Enter email HTML content..."
                    style={{
                      width: '100%',
                      height: '300px',
                      padding: '12px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      fontSize: '14px',
                      fontFamily: 'monospace',
                      resize: 'vertical'
                    }}
                  />
                  <div style={{ marginTop: '12px', fontSize: '12px', color: '#666' }}>
                    <p><strong>Available CSS classes:</strong></p>
                    <ul style={{ margin: '4px 0', paddingLeft: '16px' }}>
                      <li><code>.btn</code> - Styled button</li>
                      <li><code>.secondary-text</code> - Light colored text</li>
                    </ul>
                    <p><strong>Available variables:</strong> {'{'}{'{'} app_name {'}'}{'}'},  {'{'}{'{'} user_name {'}'}{'}'},  {'{'}{'{'} user_email {'}'}{'}'},  {'{'}{'{'} support_email {'}'}{'}'},  {'{'}{'{'} website_url {'}'}{'}'},  {'{'}{'{'} current_year {'}'}{'}'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Preview Panel */}
        <div style={{ 
          flex: previewMode === 'preview' ? 1 : 0.6,
          border: '1px solid #e1e5e9',
          borderRadius: '8px',
          overflow: 'hidden',
          backgroundColor: '#f5f5f5'
        }}>
          <div style={{
            padding: '12px 16px',
            backgroundColor: '#f8f9fa',
            borderBottom: '1px solid #e1e5e9',
            fontSize: '14px',
            fontWeight: '600'
          }}>
            Live Preview
          </div>
          
          <iframe
            srcDoc={previewHtml}
            style={{
              width: '100%',
              height: previewMode === 'preview' ? '600px' : '400px',
              border: 'none',
              backgroundColor: 'white'
            }}
            title="Email Preview"
          />
        </div>
      </div>

      {/* Variable Helper Note */}
      <div style={{
        marginTop: '16px',
        padding: '12px',
        backgroundColor: '#e3f2fd',
        borderRadius: '6px',
        border: '1px solid #bbdefb',
        fontSize: '14px',
        color: '#1565c0'
      }}>
        💡 <strong>Tip:</strong> Check the "Variable Reference" in the sidebar for a complete list of all available variables you can use in your template.
      </div>
    </div>
  )
}

export default EmailTemplateEditor