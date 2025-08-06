import type { Access } from 'payload'

// Basic access control functions
export const isAdmin: Access = ({ req: { user } }) => {
  return user?.role === 'admin'
}

export const isAdminOrEditor: Access = ({ req: { user } }) => {
  return user?.role === 'admin' || user?.role === 'editor'
}

export const isAdminOrSelf: Access = ({ req: { user }, id }) => {
  if (user?.role === 'admin') return true
  return user?.id === id
}

// Access presets for different types of collections
export const ACCESS_PRESETS = {
  // Settings collections - only admins can manage
  settings: {
    read: () => true,
    create: isAdmin,
    update: isAdmin,
    delete: isAdmin,
  },
  
  // Content collections - admins and editors can manage
  content: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdmin,
  },
  
  // User collections - special handling for self-access
  users: {
    read: isAdminOrSelf,
    create: () => true, // Allow registration
    update: isAdminOrSelf,
    delete: isAdmin,
  },
  
  // Media collections - content creators can manage
  media: {
    read: () => true,
    create: isAdminOrEditor,
    update: isAdminOrEditor,
    delete: isAdminOrEditor,
  },
}