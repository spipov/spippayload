import nodemailer from 'nodemailer'
import type { Transporter } from 'nodemailer'
import type { Payload } from 'payload'

interface EmailConfig {
  id: string
  providerName: string
  isActive: boolean
  smtpHost: string
  smtpPort: number
  smtpSecure: boolean
  smtpUsername: string
  smtpPassword: string
  fromName?: string
  fromAddress: string
}

class EmailService {
  private transporter: Transporter | null = null
  private currentConfig: EmailConfig | null = null
  private payload: Payload | null = null

  setPayload(payload: Payload) {
    this.payload = payload
  }

  async getActiveEmailConfig(): Promise<EmailConfig | null> {
    if (!this.payload) {
      console.error('Payload not initialized')
      return null
    }

    try {
      const result = await this.payload.find({
        collection: 'email-settings',
        where: {
          isActive: {
            equals: true
          }
        },
        limit: 1
      })

      if (result.docs.length === 0) {
        console.warn('No active email configuration found')
        return null
      }

      const doc = result.docs[0] as any
      return {
        id: doc.id,
        providerName: doc.providerName,
        isActive: doc.isActive,
        smtpHost: doc.smtpHost,
        smtpPort: doc.smtpPort,
        smtpSecure: doc.smtpSecure,
        smtpUsername: doc.smtpUsername,
        smtpPassword: doc.smtpPassword,
        fromName: doc.fromName,
        fromAddress: doc.fromAddress
      }
    } catch (error) {
      console.error('Error fetching email configuration:', error)
      return null
    }
  }

  async createTransporter(config?: EmailConfig): Promise<Transporter | null> {
    const emailConfig = config || await this.getActiveEmailConfig()
    
    if (!emailConfig) {
      console.warn('No email configuration available')
      return null
    }

    try {
      const transporter = nodemailer.createTransport({
        host: emailConfig.smtpHost,
        port: emailConfig.smtpPort,
        secure: emailConfig.smtpSecure,
        auth: {
          user: emailConfig.smtpUsername,
          pass: emailConfig.smtpPassword
        },
        tls: {
          rejectUnauthorized: false // Allow self-signed certificates for development
        }
      })

      // Verify the connection
      await transporter.verify()
      console.log('Email transporter created and verified successfully')
      
      return transporter
    } catch (error) {
      console.error('Error creating email transporter:', error)
      throw error
    }
  }

  async initializeTransporter(): Promise<void> {
    try {
      const config = await this.getActiveEmailConfig()
      if (config) {
        this.transporter = await this.createTransporter(config)
        this.currentConfig = config
      }
    } catch (error) {
      console.error('Failed to initialize email transporter:', error)
    }
  }

  async sendEmail({
    to,
    subject,
    text,
    html,
    configId
  }: {
    to: string
    subject: string
    text?: string
    html?: string
    configId?: string
  }): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      let transporter = this.transporter
      let config = this.currentConfig

      // If a specific config ID is provided, use that configuration
      if (configId && this.payload) {
        const specificConfig = await this.payload.findByID({
          collection: 'email-settings',
          id: configId
        }) as any

        if (specificConfig) {
          config = {
            id: specificConfig.id,
            providerName: specificConfig.providerName,
            isActive: specificConfig.isActive,
            smtpHost: specificConfig.smtpHost,
            smtpPort: specificConfig.smtpPort,
            smtpSecure: specificConfig.smtpSecure,
            smtpUsername: specificConfig.smtpUsername,
            smtpPassword: specificConfig.smtpPassword,
            fromName: specificConfig.fromName,
            fromAddress: specificConfig.fromAddress
          }
          transporter = await this.createTransporter(config)
        }
      }

      if (!transporter || !config) {
        throw new Error('No email transporter available')
      }

      const mailOptions = {
        from: config.fromName ? `"${config.fromName}" <${config.fromAddress}>` : config.fromAddress,
        to,
        subject,
        text,
        html
      }

      const info = await transporter.sendMail(mailOptions)
      console.log('Email sent successfully:', info.messageId)
      
      return {
        success: true,
        messageId: info.messageId
      }
    } catch (error) {
      console.error('Error sending email:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  async testEmailConfiguration(configId: string, testEmail: string): Promise<{ success: boolean; message: string; error?: string }> {
    try {
      if (!this.payload) {
        throw new Error('Payload not initialized')
      }

      const config = await this.payload.findByID({
        collection: 'email-settings',
        id: configId
      }) as any

      if (!config) {
        throw new Error('Email configuration not found')
      }

      const emailConfig: EmailConfig = {
        id: config.id,
        providerName: config.providerName,
        isActive: config.isActive,
        smtpHost: config.smtpHost,
        smtpPort: config.smtpPort,
        smtpSecure: config.smtpSecure,
        smtpUsername: config.smtpUsername,
        smtpPassword: config.smtpPassword,
        fromName: config.fromName,
        fromAddress: config.fromAddress
      }

      const result = await this.sendEmail({
        to: testEmail,
        subject: `Test Email from ${emailConfig.providerName}`,
        text: `This is a test email sent from your email configuration: ${emailConfig.providerName}\n\nIf you received this email, your email configuration is working correctly!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333;">Test Email from ${emailConfig.providerName}</h2>
            <p>This is a test email sent from your email configuration: <strong>${emailConfig.providerName}</strong></p>
            <p>If you received this email, your email configuration is working correctly! ✅</p>
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
            <p style="font-size: 12px; color: #666;">Sent via ${emailConfig.smtpHost}:${emailConfig.smtpPort}</p>
          </div>
        `,
        configId
      })

      if (result.success) {
        return {
          success: true,
          message: `Test email sent successfully to ${testEmail}`
        }
      } else {
        return {
          success: false,
          message: 'Failed to send test email',
          error: result.error
        }
      }
    } catch (error) {
      console.error('Error testing email configuration:', error)
      return {
        success: false,
        message: 'Failed to test email configuration',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }

  async sendSimpleTestEmail(): Promise<{ success: boolean; message: string; error?: string }> {
    try {
      const config = await this.getActiveEmailConfig()
      if (!config) {
        throw new Error('No active email configuration found')
      }

      const result = await this.sendEmail({
        to: config.fromAddress, // Send to the from address as a simple test
        subject: 'Simple Test Email',
        text: 'This is a simple test email to verify your email configuration is working.',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #333;">Simple Test Email</h2>
            <p>This is a simple test email to verify your email configuration is working.</p>
            <p>Configuration: <strong>${config.providerName}</strong></p>
            <p>✅ If you received this email, everything is working correctly!</p>
          </div>
        `
      })

      if (result.success) {
        return {
          success: true,
          message: `Test email sent successfully to ${config.fromAddress}`
        }
      } else {
        return {
          success: false,
          message: 'Failed to send test email',
          error: result.error
        }
      }
    } catch (error) {
      console.error('Error sending simple test email:', error)
      return {
        success: false,
        message: 'Failed to send simple test email',
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      }
    }
  }
}

export const emailService = new EmailService()
export default emailService