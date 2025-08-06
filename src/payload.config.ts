// storage-adapter-import-placeholder

import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { postgresAdapter } from '@payloadcms/db-postgres'
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
import { Media } from './collections/Media'
import { Roles } from './collections/Roles'
import { Users } from './collections/Users'
import { seedDefaultRoles } from './lib/seed'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Roles],
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
      {
        label: 'German',
        code: 'de',
      },
      {
        label: 'Arabic',
        code: 'ar',
      },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  sharp,
  onInit: async (payload) => {
    // Seed default roles
    await seedDefaultRoles(payload)
  },
  plugins: [
    payloadCloudPlugin(),
    // storage-adapter-placeholder
  ],
})
