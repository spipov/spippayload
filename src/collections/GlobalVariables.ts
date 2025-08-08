import type { CollectionConfig } from 'payload'

export const GlobalVariables: CollectionConfig = {
  slug: 'global-variables',
  admin: {
    useAsTitle: 'name',
    group: 'Email System',
    description: 'Manage global variables available across all email templates, headers, and footers',
    defaultColumns: ['name', 'description', 'value', 'category', 'isActive'],
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Variable name (without curly braces). Will be used as {{variable_name}}',
        placeholder: 'company_name',
      },
      validate: (value: string) => {
        if (value && !/^[a-zA-Z][a-zA-Z0-9_]*$/.test(value)) {
          return 'Variable name must start with a letter and contain only letters, numbers, and underscores'
        }
        return true
      },
    },
    {
      name: 'displayName',
      type: 'text',
      required: true,
      admin: {
        description: 'Human-readable name for this variable',
        placeholder: 'Company Name',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Detailed description of what this variable represents and when to use it',
        placeholder: 'The official name of your company or organization',
      },
    },
    {
      name: 'value',
      type: 'text',
      required: true,
      admin: {
        description: 'The actual value that will replace this variable in emails',
        placeholder: 'Acme Corporation',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Company Information', value: 'company' },
        { label: 'Contact Details', value: 'contact' },
        { label: 'Branding', value: 'branding' },
        { label: 'Legal', value: 'legal' },
        { label: 'Social Media', value: 'social' },
        { label: 'Custom', value: 'custom' },
      ],
      defaultValue: 'custom',
      admin: {
        description: 'Category to organize variables',
      },
    },
    {
      name: 'isSystem',
      type: 'checkbox',
      label: 'System Variable',
      defaultValue: false,
      admin: {
        description: 'System variables are automatically generated and cannot be edited',
        readOnly: true,
        condition: (data) => data?.isSystem === true,
      },
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Active',
      defaultValue: true,
      admin: {
        description: 'Whether this variable is available for use in templates',
      },
    },
    {
      name: 'usageExample',
      type: 'textarea',
      admin: {
        description: 'Example of how to use this variable in templates',
        placeholder: 'Use {{company_name}} in your email footer: "© 2024 {{company_name}}. All rights reserved."',
        readOnly: true,
      },
    },
    {
      name: 'lastModified',
      type: 'date',
      admin: {
        readOnly: true,
        position: 'sidebar',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        // Auto-generate usage example
        if (data.name) {
          data.usageExample = `Use {{${data.name}}} in your templates. Example: "Contact us at {{${data.name}}}"`
        }
        
        // Update last modified date
        data.lastModified = new Date().toISOString()
        
        return data
      },
    ],
    afterChange: [
      ({ doc, operation }) => {
        // Log variable changes for audit
        console.log(`Global variable "${doc.name}" was ${operation}d`)
      },
    ],
  },
}

export default GlobalVariables
