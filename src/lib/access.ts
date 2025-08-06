import type { Access, FieldAccess } from 'payload'

// Basic access control functions
export const isAdmin: Access = ({ req: { user } }) => {
  return user?.role === 'admin'
}

export const isAdminOrSelf: Access = ({ req: { user }, id }) => {
  if (user?.role === 'admin') return true
  return user?.id === id
}

export const isAdminField: FieldAccess = ({ req: { user } }) => {
  return user?.role === 'admin'
}

// Role-based access
export const canAccessAdmin = ({ req: { user } }: { req: { user: any } }) => {
  if (user?.role === 'admin') return true
  if (user?.role === 'editor') return true
  return false
}

export const canManageUsers = ({ req: { user } }: { req: { user: any } }) => {
  return user?.role === 'admin'
}

export const canManageMedia = ({ req: { user } }: { req: { user: any } }) => {
  if (user?.role === 'admin') return true
  if (user?.role === 'editor') return true
  if (user?.role === 'author') return true
  return false
}
