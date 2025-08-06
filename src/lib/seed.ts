import type { Payload } from 'payload'

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
