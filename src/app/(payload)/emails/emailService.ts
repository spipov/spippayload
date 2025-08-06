import type { Payload } from 'payload'
import { getEmailAdapter } from './email'

class EmailService {
  private static instance: EmailService
  private payload: Payload | null = null
  private currentAdapter: any = null

  private constructor() {}

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService()
    }
    return EmailService.instance
  }

  setPayload(payload: Payload) {
    this.payload = payload
  }

  async refreshEmailAdapter() {
    if (!this.payload) {
      console.warn('Payload instance not set in EmailService')
      return
    }

    try {
      this.currentAdapter = await getEmailAdapter(this.payload)
      console.log('Email adapter refreshed successfully')
    } catch (error) {
      console.error('Failed to refresh email adapter:', error)
    }
  }

  getCurrentAdapter() {
    return this.currentAdapter
  }

  async sendEmail(options: {
    to: string
    subject: string
    html?: string
    text?: string
  }) {
    if (!this.currentAdapter) {
      await this.refreshEmailAdapter()
    }

    if (!this.currentAdapter) {
      throw new Error('No email adapter configured')
    }

    // This would need to be implemented based on the adapter's interface
    // For now, this is a placeholder
    console.log('Sending email:', options)
  }
}

export const emailService = EmailService.getInstance()