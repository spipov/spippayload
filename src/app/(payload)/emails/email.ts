import { nodemailerAdapter } from '@payloadcms/email-nodemailer'
import nodemailer from 'nodemailer'
import type { Payload } from 'payload'

export async function getEmailAdapter(payload: Payload) {
  try {
    // Get the active email configuration from database
    const emailSettings = await payload.find({
      collection: 'email-settings',
      where: {
        isActive: {
          equals: true,
        },
      },
      limit: 1,
    })

    if (!emailSettings.docs.length) {
      console.warn('No active email configuration found. Email functionality will be disabled.')
      return null
    }

    const settings = emailSettings.docs[0]
    const { fromAddress, fromName, smtpHost, smtpPort, smtpSecure, smtpUsername, smtpPassword } = settings

    return nodemailerAdapter({
      defaultFromAddress: fromAddress,
      defaultFromName: fromName || 'System',
      transportOptions: {
        host: smtpHost,
        port: smtpPort,
        secure: smtpSecure || false,
        auth: {
          user: smtpUsername,
          pass: smtpPassword,
        },
      },
    })


  } catch (error) {
    console.error('Error getting email configuration:', error)
    return null
  }
}