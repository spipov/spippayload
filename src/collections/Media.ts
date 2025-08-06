import type { CollectionConfig } from 'payload'
import { canManageMedia } from '../lib/access'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: canManageMedia,
    read: () => true,
    update: canManageMedia,
    delete: canManageMedia,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      name: 'caption',
      type: 'text',
      localized: true,
    },
  ],
  upload: true,
}
