import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    // Email added by default
    {
      name: 'name',
      type: 'text',
      localized: true,
    },
    {
      name: 'preferredLocale',
      type: 'select',
      options: [
        { label: 'English', value: 'en' },
        { label: 'Spanish', value: 'es' },
        { label: 'French', value: 'fr' },
        { label: 'German', value: 'de' },
        { label: 'Arabic', value: 'ar' },
      ],
      defaultValue: 'en',
      admin: {
        description: "User's preferred language for the admin interface",
      },
    },
  ],
}
