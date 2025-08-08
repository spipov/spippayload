'use client'

import React, { useState, useEffect } from 'react'
import { useField } from '@payloadcms/ui'
import type { UIFieldClientProps } from 'payload'

interface EmailLayoutPreviewProps extends UIFieldClientProps {
  path?: string
}

const EmailLayoutPreview: React.FC<EmailLayoutPreviewProps> = (props) => {
  // Get individual form fields
  const headerEnabledField = useField({ path: 'headerEnabled' })
  const headerLayoutField = useField({ path: 'headerLayout' })
  const headerBackgroundColorField = useField({ path: 'headerBackgroundColor' })
  const headerTextColorField = useField({ path: 'headerTextColor' })
  const logoSettingsField = useField({ path: 'logoSettings' })
  const headerCustomHtmlField = useField({ path: 'headerCustomHtml' })
  const footerEnabledField = useField({ path: 'footerEnabled' })
  const footerLayoutField = useField({ path: 'footerLayout' })
  const footerBackgroundColorField = useField({ path: 'footerBackgroundColor' })
  const footerTextColorField = useField({ path: 'footerTextColor' })
  const footerCustomHtmlField = useField({ path: 'footerCustomHtml' })

  const data = {
    headerEnabled: headerEnabledField.value,
    headerLayout: headerLayoutField.value,
    headerBackgroundColor: headerBackgroundColorField.value,
    headerTextColor: headerTextColorField.value,
    logoSettings: logoSettingsField.value,
    headerCustomHtml: headerCustomHtmlField.value,
    footerEnabled: footerEnabledField.value,
    footerLayout: footerLayoutField.value,
    footerBackgroundColor: footerBackgroundColorField.value,
    footerTextColor: footerTextColorField.value,
    footerCustomHtml: footerCustomHtmlField.value,
  }
  const [previewHtml, setPreviewHtml] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [updateTimeout, setUpdateTimeout] = useState<NodeJS.Timeout | null>(null)

  const generatePreview = (): void => {
    if (!data) {
      setPreviewHtml('')
      return
    }
    
    setLoading(true)
    try {
      // Extract layout settings from the form data
      const headerSettings = {
        enabled: data.headerEnabled,
        layout: data.headerLayout,
        backgroundColor: data.headerBackgroundColor,
        textColor: data.headerTextColor,
        customHtml: data.headerCustomHtml,
        padding: {
          top: data.headerPaddingTop,
          bottom: data.headerPaddingBottom,
          left: data.headerPaddingLeft,
          right: data.headerPaddingRight
        },
        border: {
          topEnabled: data.headerBorder?.headerTopBorderEnabled,
          bottomEnabled: data.headerBorder?.headerBottomBorderEnabled,
          width: data.headerBorder?.headerBorderWidth,
          color: data.headerBorder?.headerBorderColor,
          style: data.headerBorder?.headerBorderStyle
        },
        logoSettings: data.logoSettings
      }
      const footerSettings = {
        enabled: data.footerEnabled,
        layout: data.footerLayout,
        backgroundColor: data.footerBackgroundColor,
        textColor: data.footerTextColor,
        customHtml: data.footerCustomHtml,
        padding: {
          top: data.footerPaddingTop,
          bottom: data.footerPaddingBottom,
          left: data.footerPaddingLeft,
          right: data.footerPaddingRight
        },
        border: {
          topEnabled: data.footerBorder?.footerTopBorderEnabled,
          bottomEnabled: data.footerBorder?.footerBottomBorderEnabled,
          width: data.footerBorder?.footerBorderWidth,
          color: data.footerBorder?.footerBorderColor,
          style: data.footerBorder?.footerBorderStyle
        },
        sections: data.sections
      }
      
      // Generate header HTML
      const generateHeaderHTML = () => {
        if (!headerSettings.enabled) return ''
        
        const headerStyle = {
          backgroundColor: headerSettings.backgroundColor || '#007bff',
          color: headerSettings.textColor || '#ffffff',
          padding: `${headerSettings.padding?.top || 30}px ${headerSettings.padding?.right || 20}px ${headerSettings.padding?.bottom || 30}px ${headerSettings.padding?.left || 20}px`,
          textAlign: 'center' as const,
          borderTop: headerSettings.border?.topEnabled ? `${headerSettings.border?.width || 1}px ${headerSettings.border?.style || 'solid'} ${headerSettings.border?.color || '#e9ecef'}` : 'none',
          borderBottom: headerSettings.border?.bottomEnabled ? `${headerSettings.border?.width || 1}px ${headerSettings.border?.style || 'solid'} ${headerSettings.border?.color || '#e9ecef'}` : 'none'
        }
        
        let content = ''
        switch (headerSettings.layout) {
          case 'logo-center':
            content = `
              <div style="display: flex; align-items: center; justify-content: center; gap: 15px;">
                <img src="/api/media/logo.png" alt="Logo" style="max-width: ${headerSettings.logoSettings?.maxWidth || 200}px; max-height: ${headerSettings.logoSettings?.maxHeight || 60}px;" />
                <h1 style="margin: 0; font-size: 24px;">{{app_name}}</h1>
              </div>
            `
            break
          case 'logo-left-name-right':
            content = `
              <div style="display: flex; align-items: center; justify-content: space-between;">
                <img src="/api/media/logo.png" alt="Logo" style="max-width: ${headerSettings.logoSettings?.maxWidth || 200}px; max-height: ${headerSettings.logoSettings?.maxHeight || 60}px;" />
                <h1 style="margin: 0; font-size: 24px;">{{app_name}}</h1>
              </div>
            `
            break
          case 'logo-only':
            content = `<img src="/api/media/logo.png" alt="Logo" style="max-width: ${headerSettings.logoSettings?.maxWidth || 200}px; max-height: ${headerSettings.logoSettings?.maxHeight || 60}px;" />`
            break
          case 'name-only':
            content = `<h1 style="margin: 0; font-size: 24px;">{{app_name}}</h1>`
            break
          case 'custom':
            content = headerSettings.customHtml || '<p>Custom header content</p>'
            break
          default:
            content = `<h1 style="margin: 0; font-size: 24px;">{{app_name}}</h1>`
        }
        
        return `<div style="${Object.entries(headerStyle).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`).join('; ')}">${content}</div>`
      }
      
      // Generate footer HTML
      const generateFooterHTML = () => {
        if (!footerSettings.enabled) return ''
        
        const footerStyle = {
          backgroundColor: footerSettings.backgroundColor || '#f8f9fa',
          color: footerSettings.textColor || '#666666',
          padding: `${footerSettings.padding?.top || 20}px ${footerSettings.padding?.right || 20}px ${footerSettings.padding?.bottom || 20}px ${footerSettings.padding?.left || 20}px`,
          textAlign: 'center' as const,
          fontSize: '14px',
          borderTop: footerSettings.border?.topEnabled ? `${footerSettings.border?.width || 1}px ${footerSettings.border?.style || 'solid'} ${footerSettings.border?.color || '#e9ecef'}` : 'none',
          borderBottom: footerSettings.border?.bottomEnabled ? `${footerSettings.border?.width || 1}px ${footerSettings.border?.style || 'solid'} ${footerSettings.border?.color || '#e9ecef'}` : 'none'
        }
        
        let content = ''
        if (footerSettings.layout === 'custom') {
          content = footerSettings.customHtml || '<p>Custom footer content</p>'
        } else {
          const sections = footerSettings.sections || {}
          const parts = []
          
          if (sections.showSocialLinks !== false) {
            parts.push('<div style="margin-bottom: 10px;"><a href="#" style="margin: 0 5px;">Facebook</a> | <a href="#" style="margin: 0 5px;">Twitter</a> | <a href="#" style="margin: 0 5px;">LinkedIn</a></div>')
          }
          
          if (sections.showContactInfo !== false) {
            parts.push('<div style="margin-bottom: 10px;">{{company_address}} | {{support_email}} | {{support_phone}}</div>')
          }
          
          if (sections.showLegalLinks !== false) {
            parts.push('<div style="margin-bottom: 10px;"><a href="#">Unsubscribe</a> | <a href="#">Preferences</a> | <a href="#">Privacy Policy</a></div>')
          }
          
          if (sections.showCopyright !== false) {
            parts.push('<div>© {{current_year}} {{app_name}}. All rights reserved.</div>')
          }
          
          content = parts.join('')
        }
        
        return `<div style="${Object.entries(footerStyle).map(([key, value]) => `${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value}`).join('; ')}">${content}</div>`
      }
      
      // Sample email content
      const sampleContent = `
        <div style="padding: 30px; font-family: Arial, sans-serif; line-height: 1.6;">
          <h2 style="color: #333; margin-bottom: 20px;">Sample Email Content</h2>
          <p>Hello {{user_name}},</p>
          <p>Welcome to {{app_name}}! This is a preview of how your email will look with the current layout configuration.</p>
          <p>Current year: {{current_year}}</p>
          <p>For support, contact us at {{support_email}}</p>
          <div style="margin: 20px 0; text-align: center;">
            <a href="#" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Sample Button</a>
          </div>
          <p>Best regards,<br>The {{app_name}} Team</p>
        </div>
      `
      
      // Combine header, content, and footer
      const fullEmailHTML = `
        <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          ${generateHeaderHTML()}
          ${sampleContent}
          ${generateFooterHTML()}
        </div>
      `
      
      // Replace variables with sample data
      const processedHTML = fullEmailHTML
        .replace(/{{app_name}}/g, 'My Awesome App')
        .replace(/{{user_name}}/g, 'John Doe')
        .replace(/{{current_year}}/g, new Date().getFullYear().toString())
        .replace(/{{support_email}}/g, 'support@myapp.com')
        .replace(/{{support_phone}}/g, '+1 (555) 123-4567')
        .replace(/{{company_address}}/g, '123 Main St, City, State 12345')
      
      setPreviewHtml(`
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 8px;">
          <div style="background-color: #e9ecef; padding: 8px 12px; border-radius: 4px; font-size: 12px; color: #666; margin-bottom: 15px; text-align: center;">
            Live Email Layout Preview
          </div>
          <div style="background-color: white; border-radius: 4px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            ${processedHTML}
          </div>
        </div>
      `)
    } catch (error) {
      console.error('Error generating email preview:', error)
      setPreviewHtml('<div style="color: red; padding: 20px; text-align: center;">Error generating preview</div>')
    } finally {
      setLoading(false)
    }
  }

  // Debounced preview update
  const updatePreview = () => {
    if (updateTimeout) {
      clearTimeout(updateTimeout)
    }

    const timeout = setTimeout(() => {
      generatePreview()
    }, 300) // 300ms debounce

    setUpdateTimeout(timeout)
  }

  useEffect(() => {
    updatePreview()

    // Cleanup timeout on unmount
    return () => {
      if (updateTimeout) {
        clearTimeout(updateTimeout)
      }
    }
  }, [
    headerEnabledField.value,
    headerLayoutField.value,
    headerBackgroundColorField.value,
    headerTextColorField.value,
    logoSettingsField.value,
    headerCustomHtmlField.value,
    footerEnabledField.value,
    footerLayoutField.value,
    footerBackgroundColorField.value,
    footerTextColorField.value,
    footerCustomHtmlField.value
  ])

  const handleRefresh = (): void => {
    generatePreview()
  }

  if (!data) {
    return (
      <div className="email-layout-preview">
        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
          Configure your email layout to see the live preview
        </div>
      </div>
    )
  }

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0 }}>Email Layout Preview</h3>
        <button 
          type="button"
          onClick={generatePreview}
          disabled={loading}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? 'Generating...' : 'Refresh Preview'}
        </button>
      </div>
      
      {loading ? (
        <div style={{ padding: '40px', textAlign: 'center' }}>
          <div style={{ fontSize: '14px', color: '#666' }}>Generating preview...</div>
        </div>
      ) : (
        <div style={{ minHeight: '200px' }}>
          <iframe
            srcDoc={previewHtml}
            style={{ width: '100%', height: '400px', border: 'none', borderRadius: '4px' }}
            title="Email Layout Preview"
          />
        </div>
      )}
    </div>
  )
}

export default EmailLayoutPreview