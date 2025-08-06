import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import nodemailer from 'nodemailer'
import type { Payload } from 'payload'

export async function getEmailAdapter(payload: Payload) {
  try {
    // Get the active and default email configuration from database
    const emailSettings = await payload.find({
      collection: 'email-settings',
      where: {
        and: [
          {
            isActive: {
              equals: true,
            },
          },
          {
            isDefault: {
              equals: true,
            },
          },
        ],
      },
      limit: 1,
    })

    if (!emailSettings.docs.length) {
      console.warn('No active and default email configuration found. Email functionality will be disabled.')
      return null
    }

    const settings = emailSettings.docs[0]
    const { provider, fromEmail, fromName } = settings

    switch (provider) {
      case 'smtp': {
        const { smtpSettings } = settings
        if (!smtpSettings) {
          console.error('SMTP settings not found')
          return null
        }

        return nodemailerAdapter({
          defaultFromAddress: fromEmail,
          defaultFromName: fromName,
          transportOptions: {
            host: smtpSettings.host,
            port: smtpSettings.port,
            secure: smtpSettings.secure || false,
            auth: {
              user: smtpSettings.username,
              pass: smtpSettings.password,
            },
          },
        })
      }

      case 'gmail': {
        const { gmailSettings } = settings
        if (!gmailSettings) {
          console.error('Gmail settings not found')
          return null
        }

        return nodemailerAdapter({
          defaultFromAddress: fromEmail,
          defaultFromName: fromName,
          transportOptions: {
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
              user: gmailSettings.username,
              pass: gmailSettings.appPassword,
            },
          },
        })
      }

      case 'outlook': {
        const { outlookSettings } = settings
        if (!outlookSettings) {
          console.error('Outlook settings not found')
          return null
        }

        return nodemailerAdapter({
          defaultFromAddress: fromEmail,
          defaultFromName: fromName,
          transportOptions: {
            host: 'smtp-mail.outlook.com',
            port: 587,
            secure: false,
            auth: {
              user: outlookSettings.username,
              pass: outlookSettings.password,
            },
          },
        })
      }

      case 'ses': {
        const { sesSettings } = settings
        if (!sesSettings) {
          console.error('SES settings not found')
          return null
        }

        // For SES, we need to install aws-sdk or @aws-sdk/client-ses
        // This is a basic implementation
        return nodemailerAdapter({
          defaultFromAddress: fromEmail,
          defaultFromName: fromName,
          transport: nodemailer.createTransport({
            SES: {
              aws: {
                region: sesSettings.region,
                accessKeyId: sesSettings.accessKeyId,
                secretAccessKey: sesSettings.secretAccessKey,
              },
            },
          }),
        })
      }

      default:
        console.error(`Unsupported email provider: ${provider}`)
        return null
    }
  } catch (error) {
    console.error('Error getting email configuration:', error)
    return null
  }
}