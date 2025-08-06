// storage-adapter-import-placeholder

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { getEmailAdapter } from './app/(payload)/emails/email'
import { emailService } from './app/(payload)/emails/emailService'
import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig } from 'payload'
import { ar } from 'payload/i18n/ar'
import { de } from 'payload/i18n/de'
// Import language files
import { en } from 'payload/i18n/en'
import { es } from 'payload/i18n/es'
import { fr } from 'payload/i18n/fr'
import sharp from 'sharp'
import EmailSettings from './collections/EmailSettings'
import { Media } from './collections/Media'
import { Roles } from './collections/Roles'
import { Users } from './collections/Users'


const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Roles, EmailSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  // Email configuration will be handled dynamically through EmailSettings collection
  // i18n configuration for admin interface
  i18n: {
    supportedLanguages: { en, es, fr, de, ar },
  },
  // Localization configuration for content
  localization: {
    locales: [
      {
        label: 'English',
        code: 'en',
      },
      {
        label: 'Spanish',
        code: 'es',
      },
      {
        label: 'French',
        code: 'fr',
      },
  
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  sharp,
  onInit: async (payload) => {
    // Initialize email service
    emailService.setPayload(payload)
    await emailService.refreshEmailAdapter()
  },
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
