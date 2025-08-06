import type { CollectionConfig } from 'payload'

export const Roles: CollectionConfig = {
  slug: 'roles',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'description', 'createdAt'],
  },
  access: {
    // Only admins can manage roles
    create: ({ req: { user } }) => user?.role === 'admin',
    read: ({ req: { user } }) => user?.role === 'admin',
    update: ({ req: { user } }) => user?.role === 'admin',
    delete: ({ req: { user } }) => user?.role === 'admin',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Role name (e.g., admin, editor, author, subscriber)',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief description of what this role can do',
      },
    },
    {
      name: 'permissions',
      type: 'group',
      fields: [
        {
          name: 'canAccessAdmin',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Can access the admin panel',
          },
        },
        {
          name: 'canManageUsers',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Can create, edit, and delete users',
          },
        },
        {
          name: 'canManageRoles',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Can create, edit, and delete roles',
          },
        },
        {
          name: 'canManageMedia',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Can upload and manage media files',
          },
        },
      ],
    },
  ],
}
