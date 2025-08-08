import type { CollectionConfig } from 'payload'
import { ACCESS_PRESETS } from '../access/roleBasedAccess'

const EmailSettings: CollectionConfig = {
  slug: 'email-settings',
  admin: {
    useAsTitle: 'providerName',
    group: 'Communication',
  },
  access: ACCESS_PRESETS.settings,
  fields: [
    {
      name: 'providerName',
      type: 'text',
      required: true,
      label: 'Provider Name',
      admin: {
        description: 'A friendly name for this email configuration (e.g., "Gmail", "Outlook", "SMTP Server")',
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Active Configuration',
      defaultValue: false,
      admin: {
        description: 'Only one email configuration should be active at a time',
      },
    },
    {
      name: 'smtpHost',
      type: 'text',
      required: true,
      label: 'SMTP Host',
      admin: {
        description: 'SMTP server hostname (e.g., smtp.gmail.com)',
      },
    },
    {
      name: 'smtpPort',
      type: 'number',
      required: true,
      label: 'SMTP Port',
      defaultValue: 587,
      admin: {
        description: 'SMTP server port (587 for TLS, 465 for SSL, 25 for non-secure)',
      },
    },
    {
      name: 'smtpSecure',
      type: 'checkbox',
      label: 'Use SSL/TLS',
      defaultValue: true,
      admin: {
        description: 'Enable secure connection (recommended)',
      },
    },
    {
      name: 'smtpUsername',
      type: 'text',
      required: true,
      label: 'SMTP Username',
      admin: {
        description: 'Your email address or username for authentication',
      },
    },
    {
      name: 'smtpPassword',
      type: 'text',
      required: true,
      label: 'SMTP Password',
      admin: {
        description: 'Your email password or app-specific password',
        components: {
          Field: '@/components/PasswordField',
        },
      },
    },
    {
      name: 'fromName',
      type: 'text',
      label: 'From Name',
      admin: {
        description: 'The name that will appear as the sender (optional)',
      },
    },
    {
      name: 'fromAddress',
      type: 'email',
      required: true,
      label: 'From Email Address',
      admin: {
        description: 'The email address that will appear as the sender',
      },
    },
    {
      name: 'testEmail',
      type: 'ui',
      admin: {
        components: {
          Field: '@/components/EmailTestButton',
        },
      },
    },
  ],
}

export default EmailSettings