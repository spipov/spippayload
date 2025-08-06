import type { CollectionConfig } from 'payload'
import { canAccessAdmin, isAdmin, isAdminOrSelf } from '../lib/access'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'name', 'role', 'createdAt'],
  },
  auth: true,
  access: {
    // Anyone can create users (for registration)
    create: () => true,
    // Users can read their own profile, admins can read all
    read: isAdminOrSelf,
    // Users can update their own profile, admins can update all
    update: isAdminOrSelf,
    // Only admins can delete users
    delete: isAdmin,
    // Admin access based on role
    admin: canAccessAdmin,
  },
  fields: [
    // Email and password added by default with auth: true
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'select',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'Author', value: 'author' },
        { label: 'Subscriber', value: 'subscriber' },
        { label: 'Custom Role', value: 'custom' },
      ],
      defaultValue: 'subscriber',
      required: true,
      access: {
        // Only admins can change roles
        update: ({ req: { user } }) => {
          return user?.role === 'admin'
        },
      },
      admin: {
        description: 'User role determines permissions',
      },
    },
    {
      name: 'customRole',
      type: 'relationship',
      relationTo: 'roles',
      admin: {
        condition: (data) => data.role === 'custom',
        description: 'Custom role with specific permissions',
      },
      access: {
        update: ({ req: { user } }) => {
          return user?.role === 'admin'
        },
      },
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
  hooks: {
    beforeChange: [
      async ({ data, req, operation }) => {
        // Ensure first user is always admin
        if (operation === 'create') {
          const { payload } = req
          const existingUsers = await payload.count({
            collection: 'users',
          })

          if (existingUsers.totalDocs === 0) {
            data.role = 'admin'
          }
        }

        return data
      },
    ],
  },
}
