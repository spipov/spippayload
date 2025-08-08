import type { Payload } from 'payload'
import type { AppBranding, EmailTemplate, EmailLayout } from '../payload-types'

interface EmailVariable {
  name: string
  description: string
  required: boolean
  defaultValue?: string
}

interface TemplateData {
  [key: string]: string | number | boolean | null | undefined
}

interface RenderedEmail {
  subject: string
  html: string
  text: string
  preheader?: string
}

export class EmailTemplateService {
  private payload: Payload

  constructor(payload: Payload) {
    this.payload = payload
  }

  /**
   * Get an email template by slug
   */
  async getTemplate(slug: string): Promise<EmailTemplate | null> {
    try {
      const result = await this.payload.find({
        collection: 'email-templates',
        where: {
          and: [
            { slug: { equals: slug } },
            { isActive: { equals: true } }
          ]
        },
        limit: 1,
      })

      return result.docs[0] || null
    } catch (error) {
      console.error(`Error fetching email template '${slug}':`, error)
      return null
    }
  }

  /**
   * Get active app branding configuration
   */
  async getActiveBranding(): Promise<AppBranding | null> {
    try {
      const result = await this.payload.find({
        collection: 'app-branding',
        where: {
          isActive: { equals: true }
        },
        limit: 1,
      })

      return result.docs[0] || null
    } catch (error) {
      console.error('Error fetching active app branding:', error)
      return null
    }
  }

  /**
   * Get default email layout
   */
  async getDefaultEmailLayout(): Promise<EmailLayout | null> {
    try {
      const result = await this.payload.find({
        collection: 'email-layouts',
        where: {
          and: [
            { isDefault: { equals: true } },
            { isActive: { equals: true } }
          ]
        },
        limit: 1,
      })

      return result.docs[0] || null
    } catch (error) {
      console.error('Error fetching default email layout:', error)
      return null
    }
  }

  /**
   * Process global variables from branding configuration
   */
  private processGlobalVariables(
    branding: AppBranding,
    userVariables: TemplateData = {},
    systemData: TemplateData = {}
  ): TemplateData {
    const globalVars: TemplateData = {}
    
    // Process global variables from branding
    const globalVariables = (branding.globalVariables || []) as any[]
    
    globalVariables.forEach((variable: any) => {
      const { name, value, isSystemGenerated } = variable
      
      if (isSystemGenerated) {
        // Use system-provided data for system variables
        if (name === 'current_year') {
          globalVars[name] = new Date().getFullYear().toString()
        } else if (name === 'user_name' && systemData.user_name) {
          globalVars[name] = systemData.user_name
        } else if (name === 'user_email' && systemData.user_email) {
          globalVars[name] = systemData.user_email
        } else {
          // Fallback to configured value for system variables
          globalVars[name] = value || ''
        }
      } else {
        // Use configured value for user-editable variables
        globalVars[name] = value || ''
      }
    })
    
    // Add legacy branding variables for backward compatibility
    globalVars.app_name = branding.appName || 'Your App'
    globalVars.site_name = branding.appName || 'Your App'
    globalVars.support_email = branding.contact?.supportEmail || ''
    globalVars.website_url = branding.contact?.website || ''
    
    // User variables override global ones (except system-generated)
    Object.entries(userVariables).forEach(([key, value]) => {
      const globalVar = globalVariables.find((v: any) => v.name === key)
      if (!globalVar || !globalVar.isSystemGenerated) {
        globalVars[key] = value
      }
    })
    
    return globalVars
  }

  /**
   * Replace variables in a string with actual values
   */
  private replaceVariables(
    content: string,
    variables: TemplateData,
    templateVariables: EmailVariable[] = []
  ): string {
    let result = content

    // Replace template variables (support both {{variable}} and {{ variable }} formats)
    Object.entries(variables).forEach(([key, value]) => {
      // New format: {{variable}} (no spaces)
      const regexNoSpaces = new RegExp(`{{${key}}}`, 'g')
      // Legacy format: {{ variable }} (with spaces)
      const regexWithSpaces = new RegExp(`{{\\s*${key}\\s*}}`, 'g')
      
      const stringValue = String(value || '')
      result = result.replace(regexNoSpaces, stringValue)
      result = result.replace(regexWithSpaces, stringValue)
    })

    // Check for required variables that weren't provided
    templateVariables.forEach((templateVar) => {
      if (templateVar.required && !(templateVar.name in variables)) {
        const defaultValue = templateVar.defaultValue || `[${templateVar.name}]`
        const regexNoSpaces = new RegExp(`{{${templateVar.name}}}`, 'g')
        const regexWithSpaces = new RegExp(`{{\\s*${templateVar.name}\\s*}}`, 'g')
        result = result.replace(regexNoSpaces, defaultValue)
        result = result.replace(regexWithSpaces, defaultValue)
      }
    })

    return result
  }

  /**
   * Generate HTML email with branding
   */
  private generateBrandedHTML(
    content: string,
    branding: AppBranding,
    preheader?: string,
    emailLayout?: EmailLayout | null
  ): string {
    const logoUrl = typeof branding.logo === 'object' && branding.logo?.url 
      ? branding.logo.url 
      : '/default-logo.png'

    const colors = branding.colors || {}
    const typography = branding.typography || {}
    const contact = branding.contact || {}
    const socialLinks = branding.socialLinks || []
    const emailSettings = branding.emailSettings || {}

    // Use email layout settings or fallback to defaults
    const layout = emailLayout || {} as any
    const headerSettings = (layout as any)?.headerSettings || {}
    const footerSettings = (layout as any)?.footerSettings || {}

    // Generate social media links HTML
    const socialLinksHTML = socialLinks.map(link => {
      const platform = link.platform || ''
      const url = link.url || '#'
      return `
        <a href="${url}" style="color: ${colors.primary || '#007bff'}; text-decoration: none; margin: 0 8px;">
          ${platform.charAt(0).toUpperCase() + platform.slice(1)}
        </a>
      `
    }).join('')

    // Generate header HTML based on layout settings
    const generateHeaderHTML = () => {
      if (!headerSettings.enabled) return ''
      
      const headerBgColor = headerSettings.backgroundColor || colors.primary || '#007bff'
      const headerTextColor = headerSettings.textColor || 'white'
      const headerPadding = headerSettings.padding || '20px'
      
      if (headerSettings.customHtml) {
        return `
        <div class="email-header" style="background-color: ${headerBgColor}; color: ${headerTextColor}; padding: ${headerPadding};">
          ${headerSettings.customHtml}
        </div>
        `
      }
      
      const logoSection = headerSettings.logoSettings?.enabled ? `
        <img src="${logoUrl}" alt="${branding.appName || 'Logo'}" style="max-width: ${headerSettings.logoSettings.maxWidth || '200px'}; height: auto;" />
      ` : ''
      
      return `
      <div class="email-header" style="text-align: center; padding: ${headerPadding}; background-color: ${headerBgColor}; color: ${headerTextColor};">
        ${logoSection}
        <h1 style="margin: 10px 0 0 0; font-size: 24px;">${branding.appName || 'Your App'}</h1>
        ${branding.tagline ? `<p style="margin: 5px 0 0 0; opacity: 0.9;">${branding.tagline}</p>` : ''}
      </div>
      `
    }

    // Generate footer HTML based on layout settings
    const generateFooterHTML = () => {
      if (!footerSettings.enabled) return ''
      
      const footerBgColor = footerSettings.backgroundColor || '#f8f9fa'
      const footerTextColor = footerSettings.textColor || colors.textLight || '#666666'
      const footerPadding = footerSettings.padding || '20px'
      
      if (footerSettings.customHtml) {
        return `
        <div class="email-footer" style="background-color: ${footerBgColor}; color: ${footerTextColor}; padding: ${footerPadding};">
          ${footerSettings.customHtml}
        </div>
        `
      }
      
      return `
      <div class="email-footer" style="padding: ${footerPadding}; background-color: ${footerBgColor}; text-align: center; font-size: 14px; color: ${footerTextColor}; border-top: 1px solid #e9ecef;">
        ${socialLinks.length > 0 ? `
        <div class="social-links" style="margin: 10px 0;">
          <strong>Follow us:</strong><br>
          ${socialLinksHTML}
        </div>
        ` : ''}
        
        <div class="footer-links" style="margin: 10px 0;">
          ${emailSettings.showPreferencesLink ? '<a href="#" style="color: ' + footerTextColor + '; text-decoration: none; margin: 0 10px;">Email Preferences</a>' : ''}
          ${emailSettings.showUnsubscribeLink ? '<a href="#" style="color: ' + footerTextColor + '; text-decoration: none; margin: 0 10px;">Unsubscribe</a>' : ''}
          ${emailSettings.includeViewInBrowser ? '<a href="#" style="color: ' + footerTextColor + '; text-decoration: none; margin: 0 10px;">View in Browser</a>' : ''}
        </div>
        
        <div style="margin-top: 15px;">
          <strong>${branding.appName || 'Your App'}</strong><br>
          ${contact.supportEmail ? `Email: <a href="mailto:${contact.supportEmail}" style="color: ${colors.primary || '#007bff'};">${contact.supportEmail}</a><br>` : ''}
          ${contact.phone ? `Phone: ${contact.phone}<br>` : ''}
          ${contact.website ? `Website: <a href="${contact.website}" style="color: ${colors.primary || '#007bff'};">${contact.website}</a><br>` : ''}
          ${contact.address ? `<br>${contact.address.replace(/\n/g, '<br>')}` : ''}
        </div>
      </div>
      `
    }

    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${branding.appName || 'Email'}</title>
  ${preheader ? `<meta name="description" content="${preheader}">` : ''}
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: ${typography.fontFamily || 'Arial, sans-serif'};
      font-size: ${typography.fontSize || 16}px;
      line-height: ${typography.lineHeight || 1.5};
      color: ${colors.text || '#333333'};
      background-color: ${colors.background || '#ffffff'};
    }
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: ${colors.background || '#ffffff'};
    }
    .email-header {
      text-align: center;
      padding: 20px;
      background-color: ${colors.primary || '#007bff'};
      color: white;
    }
    .email-header img {
      max-width: 200px;
      height: auto;
    }
    .email-content {
      padding: 30px 20px;
    }
    .email-footer {
      padding: 20px;
      background-color: #f8f9fa;
      text-align: center;
      font-size: 14px;
      color: ${colors.textLight || '#666666'};
      border-top: 1px solid #e9ecef;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: ${colors.primary || '#007bff'};
      color: white;
      text-decoration: none;
      border-radius: 4px;
      font-weight: bold;
    }
    .button:hover {
      background-color: ${colors.secondary || '#0056b3'};
    }
    a {
      color: ${colors.primary || '#007bff'};
    }
    .social-links {
      margin: 10px 0;
    }
    .footer-links {
      margin: 10px 0;
    }
    .footer-links a {
      color: ${colors.textLight || '#666666'};
      text-decoration: none;
      margin: 0 10px;
    }
  </style>
</head>
<body>
  ${preheader ? `
  <div style="display: none; max-height: 0; overflow: hidden;">
    ${preheader}
  </div>
  ` : ''}
  
  <div class="email-container">
    ${generateHeaderHTML()}
    
    <div class="email-content" style="padding: 30px 20px;">
      ${content}
    </div>
    
    ${generateFooterHTML()}
  </div>
</body>
</html>
    `.trim()
  }

  /**
   * Render an email template with variables and branding
   */
  async renderTemplate(
    templateSlug: string,
    variables: TemplateData = {},
    brandingId?: string,
    systemData: TemplateData = {}
  ): Promise<RenderedEmail | null> {
    try {
      // Get the template
      const template = await this.getTemplate(templateSlug)
      if (!template) {
        throw new Error(`Template '${templateSlug}' not found or inactive`)
      }

      // Get branding (either specified or active default)
      let branding: AppBranding | null = null
      if (brandingId) {
        const brandingResult = await this.payload.findByID({
          collection: 'app-branding',
          id: brandingId,
        })
        branding = brandingResult as AppBranding
      } else if (template.branding && typeof template.branding === 'object') {
        branding = template.branding as AppBranding
      } else {
        branding = await this.getActiveBranding()
      }

      if (!branding) {
        throw new Error('No branding configuration found')
      }

      // Get email layout
      const emailLayout = await this.getDefaultEmailLayout()

      // Process global variables with new system
      const globalVariables = this.processGlobalVariables(
        branding,
        variables,
        systemData
      )

      // Get template variables for validation
      const templateVariables = (template.variables || []) as EmailVariable[]

      // Render content
      const subject = this.replaceVariables(
        template.subject || '',
        globalVariables,
        templateVariables
      )

      const textContent = this.replaceVariables(
        typeof template.textContent === 'string' ? template.textContent : '',
        globalVariables,
        templateVariables
      )     const htmlContent = this.replaceVariables(
        (template.htmlContent as string) || '',
        globalVariables,
        templateVariables
      )

      const preheader = template.preheader
        ? this.replaceVariables(
            template.preheader,
            globalVariables,
            templateVariables
          )
        : undefined

      // Generate branded HTML
      const brandedHTML = this.generateBrandedHTML(
        htmlContent,
        branding,
        preheader,
        emailLayout
      )

      return {
        subject,
        html: brandedHTML,
        text: textContent,
        preheader,
      }
    } catch (error) {
      console.error(`Error rendering email template '${templateSlug}':`, error)
      return null
    }
  }

  /**
   * Validate template variables
   */
  validateTemplateVariables(
    template: EmailTemplate,
    variables: TemplateData
  ): { valid: boolean; missingRequired: string[]; errors: string[] } {
    const templateVariables = (template.variables || []) as EmailVariable[]
    const missingRequired: string[] = []
    const errors: string[] = []

    templateVariables.forEach((templateVar) => {
      if (templateVar.required && !(templateVar.name in variables)) {
        missingRequired.push(templateVar.name)
      }
    })

    if (missingRequired.length > 0) {
      errors.push(`Missing required variables: ${missingRequired.join(', ')}`)
    }

    return {
      valid: errors.length === 0,
      missingRequired,
      errors,
    }
  }
}

// Export a singleton instance
let emailTemplateService: EmailTemplateService | null = null

export const getEmailTemplateService = (payload: Payload): EmailTemplateService => {
  if (!emailTemplateService) {
    emailTemplateService = new EmailTemplateService(payload)
  }
  return emailTemplateService
}

export default EmailTemplateService