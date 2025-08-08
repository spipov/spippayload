'use client'

import React, { useState, useEffect } from 'react'
import { useField } from '@payloadcms/ui'

interface EmailPreviewProps {
  path?: string
}

interface EmailTemplate {
  id: string
  name: string
  subject: string
  htmlContent: string
  textContent: string
  category: string
}

export const EmailPreview: React.FC<EmailPreviewProps> = ({ path = '' }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('')
  const [templates, setTemplates] = useState<EmailTemplate[]>([])
  const [loading, setLoading] = useState(false)
  const [previewMode, setPreviewMode] = useState<'desktop' | 'mobile'>('desktop')

  // Get current branding values from form
  const appNameField = useField({ path: `${path}appName` })
  const taglineField = useField({ path: `${path}tagline` })
  const primaryColorField = useField({ path: `${path}colors.primary` })
  const secondaryColorField = useField({ path: `${path}colors.secondary` })
  const accentColorField = useField({ path: `${path}colors.accent` })
  const backgroundColorField = useField({ path: `${path}colors.background` })
  const textColorField = useField({ path: `${path}colors.text` })
  const textLightColorField = useField({ path: `${path}colors.textLight` })
  const fontFamilyField = useField({ path: `${path}typography.fontFamily` })
  const fontSizeField = useField({ path: `${path}typography.fontSize` })
  const lineHeightField = useField({ path: `${path}typography.lineHeight` })
  const supportEmailField = useField({ path: `${path}contact.supportEmail` })
  const websiteField = useField({ path: `${path}contact.website` })
  const socialMediaField = useField({ path: `${path}socialMedia` })

  const branding = {
    appName: (appNameField.value as string) || 'Your App Name',
    tagline: (taglineField.value as string) || 'Welcome to our platform',
    colors: {
      primary: (primaryColorField.value as string) || '#007bff',
      secondary: (secondaryColorField.value as string) || '#6c757d',
      accent: (accentColorField.value as string) || '#28a745',
      background: (backgroundColorField.value as any) || { type: 'solid', color: '#ffffff' },
      text: (textColorField.value as string) || '#333333',
      textLight: (textLightColorField.value as string) || '#666666',
    },
    typography: {
      fontFamily: (fontFamilyField.value as string) || 'Arial, sans-serif',
      fontSize: (fontSizeField.value as string) || '16',
      lineHeight: (lineHeightField.value as string) || '1.6',
    },
    contact: {
      supportEmail: (supportEmailField.value as string) || 'support@yourapp.com',
      website: (websiteField.value as string) || 'https://yourapp.com',
    },
    socialMedia: (socialMediaField.value as any[]) || [],
  }

  // Fetch email templates
  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true)
      try {
        const response = await fetch('/api/email-templates')
        if (response.ok) {
          const data = await response.json()
          setTemplates(data.docs || [])
          if (data.docs && data.docs.length > 0) {
            setSelectedTemplate(data.docs[0].id)
          }
        }
      } catch (error) {
        console.error('Failed to fetch templates:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTemplates()
  }, [])

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate)

  // Replace variables in template content
  const replaceVariables = (content: string) => {
    if (!content) return ''
    
    const variables = {
      '{{app_name}}': branding.appName,
      '{{site_name}}': branding.appName,
      '{{tagline}}': branding.tagline,
      '{{user_name}}': 'John Doe',
      '{{user_email}}': 'john.doe@example.com',
      '{{support_email}}': branding.contact.supportEmail,
      '{{website_url}}': branding.contact.website,
      '{{current_year}}': new Date().getFullYear().toString(),
    }

    let processedContent = content
    Object.entries(variables).forEach(([variable, value]) => {
      processedContent = processedContent.replace(new RegExp(variable, 'g'), value)
    })

    return processedContent
  }

  // Generate styled email HTML
  const generateStyledEmail = () => {
    if (!selectedTemplateData) return ''

    const baseStyles = `
      <style>
        body {
          font-family: ${branding.typography.fontFamily};
          font-size: ${branding.typography.fontSize}px;
          line-height: ${branding.typography.lineHeight};
          color: ${branding.colors.text};
          background-color: ${(branding.colors.background as any)?.color || '#ffffff'};
          margin: 0;
          padding: 20px;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: ${(branding.colors.background as any)?.color || '#ffffff'};
        }
        .email-header {
          background-color: ${branding.colors.primary};
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
          color: ${branding.colors.text};
          margin: 0 0 16px 0;
          font-size: 24px;
        }
        .email-content h3 {
          color: ${branding.colors.text};
          margin: 0 0 12px 0;
          font-size: 20px;
        }
        .email-content p {
          margin: 0 0 16px 0;
          line-height: ${branding.typography.lineHeight};
        }
        .email-content .secondary-text {
          color: ${branding.colors.textLight};
        }
        .btn {
          display: inline-block;
          background-color: ${branding.colors.accent};
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
          border-top: 1px solid ${branding.colors.secondary};
          padding: 20px;
          text-align: center;
          color: ${branding.colors.textLight};
          font-size: 14px;
        }
        .social-links {
          margin: 16px 0;
        }
        .social-links a {
          color: ${branding.colors.primary};
          margin: 0 8px;
          text-decoration: none;
        }
        .divider {
          border: none;
          border-top: 1px solid ${branding.colors.secondary};
          margin: 20px 0;
        }
      </style>
    `

    const headerHtml = `
      <div class="email-header">
        <h1>${branding.appName}</h1>
        <p>${branding.tagline}</p>
      </div>
    `

    const footerHtml = `
      <div class="email-footer">
        <p>Follow us on social media</p>
        <div class="social-links">
          ${(branding.socialMedia as any[]).map((social: any) => 
            `<a href="${social.url}">${social.platform}</a>`
          ).join('')}
        </div>
        <hr class="divider">
        <p>© ${new Date().getFullYear()} ${branding.appName}. All rights reserved.</p>
        <p>
          <a href="${branding.contact.website}" style="color: ${branding.colors.primary};">Visit our website</a> | 
          <a href="mailto:${branding.contact.supportEmail}" style="color: ${branding.colors.primary};">Contact Support</a>
        </p>
      </div>
    `

    const processedContent = replaceVariables(selectedTemplateData.htmlContent || '')
    
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${replaceVariables(selectedTemplateData.subject)}</title>
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
  }

  return (
    <div style={{ marginTop: '20px' }}>
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
            Live Email Preview
          </h4>
          <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>
            See how your branding changes affect email templates in real-time
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* Template Selector */}
          <select
            value={selectedTemplate}
            onChange={(e) => setSelectedTemplate(e.target.value)}
            style={{
              padding: '8px 12px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '14px',
              minWidth: '150px'
            }}
            disabled={loading}
          >
            {loading ? (
              <option>Loading templates...</option>
            ) : (
              templates.map(template => (
                <option key={template.id} value={template.id}>
                  {template.name}
                </option>
              ))
            )}
          </select>

          {/* Device Toggle */}
          <div style={{ display: 'flex', border: '1px solid #ddd', borderRadius: '4px', overflow: 'hidden' }}>
            <button
              type="button"
              onClick={() => setPreviewMode('desktop')}
              style={{
                padding: '8px 12px',
                border: 'none',
                backgroundColor: previewMode === 'desktop' ? branding.colors.primary : 'white',
                color: previewMode === 'desktop' ? 'white' : '#666',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Desktop
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode('mobile')}
              style={{
                padding: '8px 12px',
                border: 'none',
                backgroundColor: previewMode === 'mobile' ? branding.colors.primary : 'white',
                color: previewMode === 'mobile' ? 'white' : '#666',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Mobile
            </button>
          </div>
        </div>
      </div>

      {/* Email Preview */}
      <div style={{
        border: '1px solid #e1e5e9',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: '#f5f5f5',
        minHeight: '400px'
      }}>
        {selectedTemplateData ? (
          <iframe
            srcDoc={generateStyledEmail()}
            style={{
              width: '100%',
              height: '600px',
              border: 'none',
              backgroundColor: 'white',
              transform: previewMode === 'mobile' ? 'scale(0.4)' : 'scale(1)',
              transformOrigin: 'top left',
              maxWidth: previewMode === 'mobile' ? '375px' : '100%',
              margin: previewMode === 'mobile' ? '0 auto' : '0'
            }}
            title="Email Preview"
          />
        ) : (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '400px',
            color: '#666',
            fontSize: '16px'
          }}>
            {loading ? 'Loading email templates...' : 'No email template selected'}
          </div>
        )}
      </div>

      {/* Template Info */}
      {selectedTemplateData && (
        <div style={{
          marginTop: '16px',
          padding: '16px',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #e1e5e9'
        }}>
          <h5 style={{ margin: '0 0 8px 0', fontSize: '14px', fontWeight: '600' }}>
            Template: {selectedTemplateData.name}
          </h5>
          <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#666' }}>
            <strong>Subject:</strong> {replaceVariables(selectedTemplateData.subject)}
          </p>
          <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#666' }}>
            <strong>Category:</strong> {selectedTemplateData.category}
          </p>
          <details style={{ marginTop: '12px' }}>
            <summary style={{ cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}>
              Available Variables
            </summary>
            <div style={{ marginTop: '8px', fontSize: '12px', fontFamily: 'monospace' }}>
              <div>{'{{app_name}}'} - {branding.appName}</div>
            <div>{'{{site_name}}'} - {branding.appName}</div>
            <div>{'{{tagline}}'} - {branding.tagline}</div>
            <div>{'{{user_name}}'} - John Doe (sample)</div>
            <div>{'{{user_email}}'} - john.doe@example.com (sample)</div>
            <div>{'{{support_email}}'} - {branding.contact.supportEmail}</div>
            <div>{'{{website_url}}'} - {branding.contact.website}</div>
            <div>{'{{current_year}}'} - {new Date().getFullYear()}</div>
            </div>
          </details>
        </div>
      )}
    </div>
  )
}

export default EmailPreview