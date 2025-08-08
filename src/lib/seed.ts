import type { Payload } from 'payload'

export const seedEmailTemplates = async (payload: Payload) => {
  console.log('Checking and seeding email templates...')

  const templatesToSeed = [
    {
      slug: 'welcome-email',
      name: 'Welcome Email'
    },
    {
      slug: 'password-reset',
      name: 'Password Reset'
    },
    {
      slug: 'email-verification',
      name: 'Email Verification'
    },
    {
      slug: 'account-update',
      name: 'Account Update Notification'
    },
    {
      slug: 'maintenance-notification',
      name: 'System Maintenance Notification'
    }
  ]

  for (const template of templatesToSeed) {
    const existing = await payload.find({
      collection: 'email-templates',
      where: {
        slug: {
          equals: template.slug
        }
      }
    })

    if (existing.docs.length > 0) {
      console.log(`Template '${template.name}' already exists, skipping`)
      continue
    }

    console.log(`Seeding template: ${template.name}`)
    
    if (template.slug === 'welcome-email') {
      // Welcome Email Template
      await payload.create({
        collection: 'email-templates',
        data: {
      name: 'Welcome Email',
      slug: 'welcome-email',
      category: 'auth',
      subject: 'Welcome to {{appName}}, {{userName}}!',
      preheader: 'Get started with your new account and explore our features.',
      htmlContent: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Hello {{userName}}, Welcome to {{appName}}! We are excited to have you on board. Your account has been successfully created. If you have any questions, feel free to reach out to our support team. Best regards, The {{appName}} Team',
                  version: 1
                }
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1
            }
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1
        }
      },
      textContent: 'Hello {{userName}},\n\nWelcome to {{appName}}! We\'re excited to have you on board.\n\nYour account has been successfully created. You can now access all our features and start exploring.\n\nIf you have any questions, feel free to reach out to our support team.\n\nBest regards,\nThe {{appName}} Team',
      // variables: [
      //   {
      //     name: 'userName',
      //     description: 'The user\'s display name',
      //     required: true,
      //     defaultValue: 'User'
      //   },
      //   {
      //     name: 'appName',
      //     description: 'The application name',
      //     required: true,
      //     defaultValue: 'Our App'
      //   }
      // ],
      isActive: true,
      testData: {
        userName: 'John Doe',
        appName: 'MyApp'
      }
    }
  })
    } else if (template.slug === 'password-reset') {
      // Password Reset Email Template
      await payload.create({
    collection: 'email-templates',
    data: {
      name: 'Password Reset',
      slug: 'password-reset',
      category: 'auth',
      subject: 'Reset your {{appName}} password',
      preheader: 'Click the link below to reset your password securely.',
      htmlContent: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Hello {{userName}}, We received a request to reset your password for your {{appName}} account. Click the link below to reset your password: {{resetLink}} This link will expire in {{expirationTime}}. If you did not request this reset, please ignore this email. Best regards, The {{appName}} Team',
                  version: 1
                }
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1
            }
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1
        }
      },
      textContent: 'Hello {{userName}},\n\nWe received a request to reset your password for your {{appName}} account.\n\nClick the link below to reset your password:\n{{resetLink}}\n\nThis link will expire in {{expirationTime}}. If you didn\'t request this reset, please ignore this email.\n\nBest regards,\nThe {{appName}} Team',
      // variables: [
      //   {
      //     name: 'userName',
      //     description: 'The user\'s display name',
      //     required: true,
      //     defaultValue: 'User'
      //   },
      //   {
      //     name: 'appName',
      //     description: 'The application name',
      //     required: true,
      //     defaultValue: 'Our App'
      //   },
      //   {
      //     name: 'resetLink',
      //     description: 'The password reset link',
      //     required: true,
      //     defaultValue: 'https://example.com/reset'
      //   },
      //   {
      //     name: 'expirationTime',
      //     description: 'How long the reset link is valid',
      //     required: false,
      //     defaultValue: '24 hours'
      //   }
      // ],
      isActive: true,
      testData: {
        userName: 'John Doe',
        appName: 'MyApp',
        resetLink: 'https://example.com/reset?token=abc123',
        expirationTime: '24 hours'
      }
    }
  })
    } else if (template.slug === 'email-verification') {
      // Email Verification Template
      await payload.create({
    collection: 'email-templates',
    data: {
      name: 'Email Verification',
      slug: 'email-verification',
      category: 'auth',
      subject: 'Verify your {{appName}} email address',
      preheader: 'Please verify your email address to complete your registration.',
      htmlContent: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Hello {{userName}}, Thank you for signing up for {{appName}}! To complete your registration, please verify your email address by clicking this link: {{verificationLink}} If you did not create an account, please ignore this email. Best regards, The {{appName}} Team',
                  version: 1
                }
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1
            }
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1
        }
      },
      textContent: 'Hello {{userName}},\n\nThank you for signing up for {{appName}}! To complete your registration, please verify your email address.\n\nClick the link below to verify your email:\n{{verificationLink}}\n\nIf you didn\'t create an account with {{appName}}, please ignore this email.\n\nBest regards,\nThe {{appName}} Team',
      // variables: [
      //   {
      //     name: 'userName',
      //     description: 'The user\'s display name',
      //     required: true,
      //     defaultValue: 'User'
      //   },
      //   {
      //     name: 'appName',
      //     description: 'The application name',
      //     required: true,
      //     defaultValue: 'Our App'
      //   },
      //   {
      //     name: 'verificationLink',
      //     description: 'The email verification link',
      //     required: true,
      //     defaultValue: 'https://example.com/verify'
      //   }
      // ],
      isActive: true,
      testData: {
        userName: 'John Doe',
        appName: 'MyApp',
        verificationLink: 'https://example.com/verify?token=xyz789'
      }
    }
  })
    } else if (template.slug === 'account-update') {
      // Account Update Notification Template
      await payload.create({
    collection: 'email-templates',
    data: {
      name: 'Account Update Notification',
      slug: 'account-update',
      category: 'account',
      subject: 'Your {{appName}} account has been updated',
      preheader: 'We\'re letting you know about recent changes to your account.',
      htmlContent: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Hello {{userName}}, We are writing to let you know that your {{appName}} account has been updated. Changes made: {{changeDescription}} Date: {{updateDate}} If you did not make these changes, please contact our support team immediately. Best regards, The {{appName}} Team',
                  version: 1
                }
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1
            }
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1
        }
      },
      textContent: 'Hello {{userName}},\n\nWe\'re writing to let you know that your {{appName}} account has been updated.\n\nChanges made: {{changeDescription}}\nDate: {{updateDate}}\n\nIf you didn\'t make these changes, please contact our support team immediately.\n\nBest regards,\nThe {{appName}} Team',
      // variables: [
      //   {
      //     name: 'userName',
      //     description: 'The user\'s display name',
      //     required: true,
      //     defaultValue: 'User'
      //   },
      //   {
      //     name: 'appName',
      //     description: 'The application name',
      //     required: true,
      //     defaultValue: 'Our App'
      //   },
      //   {
      //     name: 'changeDescription',
      //     description: 'Description of what was changed',
      //     required: true,
      //     defaultValue: 'Profile information updated'
      //   },
      //   {
      //     name: 'updateDate',
      //     description: 'When the update occurred',
      //     required: true,
      //     defaultValue: 'Today'
      //   }
      // ],
      isActive: true,
      testData: {
        userName: 'John Doe',
        appName: 'MyApp',
        changeDescription: 'Email address and profile picture updated',
        updateDate: 'January 15, 2024 at 2:30 PM'
      }
    }
  })
    } else if (template.slug === 'maintenance-notification') {
      // System Maintenance Notification Template
      await payload.create({
    collection: 'email-templates',
    data: {
      name: 'System Maintenance Notification',
      slug: 'maintenance-notification',
      category: 'system',
      subject: 'Scheduled maintenance for {{appName}}',
      preheader: 'We\'ll be performing scheduled maintenance on our systems.',
      htmlContent: {
        root: {
          type: 'root',
          children: [
            {
              type: 'paragraph',
              children: [
                {
                  type: 'text',
                  text: 'Hello {{userName}}, We wanted to let you know that {{appName}} will be undergoing scheduled maintenance. Maintenance Window: {{maintenanceWindow}} Expected Duration: {{duration}} During this time, you may experience limited access to some features. We apologize for any inconvenience. Thank you for your patience. The {{appName}} Team',
                  version: 1
                }
              ],
              direction: 'ltr',
              format: '',
              indent: 0,
              version: 1
            }
          ],
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1
        }
      },
      textContent: 'Hello {{userName}},\n\nWe wanted to let you know that {{appName}} will be undergoing scheduled maintenance.\n\nMaintenance Window: {{maintenanceWindow}}\nExpected Duration: {{duration}}\n\nDuring this time, you may experience limited access to some features. We apologize for any inconvenience.\n\nThank you for your patience.\n\nThe {{appName}} Team',
      // variables: [
      //   {
      //     name: 'userName',
      //     description: 'The user\'s display name',
      //     required: false,
      //     defaultValue: 'User'
      //   },
      //   {
      //     name: 'appName',
      //     description: 'The application name',
      //     required: true,
      //     defaultValue: 'Our App'
      //   },
      //   {
      //     name: 'maintenanceWindow',
      //     description: 'When the maintenance will occur',
      //     required: true,
      //     defaultValue: 'Sunday, 2:00 AM - 4:00 AM EST'
      //   },
      //   {
      //     name: 'duration',
      //     description: 'How long the maintenance is expected to last',
      //     required: true,
      //     defaultValue: '2 hours'
      //   }
      // ],
      isActive: true,
      testData: {
        userName: 'John Doe',
        appName: 'MyApp',
        maintenanceWindow: 'Sunday, January 21st, 2:00 AM - 4:00 AM EST',
        duration: '2 hours'
      }
    }
  })
    }
  }

  console.log('Email template seeding completed')
}

export const seedDefaultRoles = async (payload: Payload) => {
  // Check if roles already exist
  const existingRoles = await payload.count({
    collection: 'roles',
  })

  if (existingRoles.totalDocs > 0) {
    console.log('Roles already exist, skipping seed')
    return
  }

  console.log('Seeding default roles...')

  // Editor role
  await payload.create({
    collection: 'roles',
    data: {
      name: 'editor',
      description: 'Can access admin and manage content',
      permissions: {
        canAccessAdmin: true,
        canManageUsers: false,
        canManageRoles: false,
        canManageMedia: true,
      },
    },
  })

  // Author role
  await payload.create({
    collection: 'roles',
    data: {
      name: 'author',
      description: 'Can create and manage own content',
      permissions: {
        canAccessAdmin: true,
        canManageUsers: false,
        canManageRoles: false,
        canManageMedia: true,
      },
    },
  })

  // Subscriber role
  await payload.create({
    collection: 'roles',
    data: {
      name: 'subscriber',
      description: 'Basic user with limited access',
      permissions: {
        canAccessAdmin: false,
        canManageUsers: false,
        canManageRoles: false,
        canManageMedia: false,
      },
    },
  })

  console.log('Default roles seeded successfully')
}
