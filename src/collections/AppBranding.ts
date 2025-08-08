import type { CollectionConfig } from "payload";

export const AppBranding: CollectionConfig = {
  slug: "app-branding",
  labels: {
    singular: "Branding",
    plural: "Branding",
  },
  admin: {
    useAsTitle: "appName",
    group: "Settings",
    description: "Manage app-wide branding, colors, and visual identity",
  },
  access: {
    read: () => true,
    create: ({ req: { user } }: any) => !!user,
    update: ({ req: { user } }: any) => !!user,
    delete: ({ req: { user } }: any) => !!user,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      defaultValue: "Default Brand",
      admin: {
        description: "Internal name for this branding configuration",
      },
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
      required: true,
      admin: {
        description:
          "Primary logo (recommended: 200x60px for emails, 300x100px for web)",
      },
    },
    {
      name: "favicon",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "Website favicon (32x32px)",
      },
    },
    {
      name: "appName",
      type: "text",
      required: true,
      defaultValue: "Your App Name",
      admin: {
        description: "Application/brand name displayed across the app",
      },
    },
    {
      name: "tagline",
      type: "text",
      defaultValue: "Your app tagline",
      admin: {
        description: "Optional tagline displayed below the app name",
      },
    },
    {
      name: "colors",
      type: "group",
      label: "Color Palette",
      admin: {
        description: "Define your app's color scheme with live preview",
        components: {
          Field: "@/components/ColorPaletteField",
        },
      },
      fields: [
        {
          name: "primary",
          type: "text",
          label: "Primary Color",
          defaultValue: "#007bff",
          admin: {
            description: "Main brand color (buttons, links, headers)",
            components: {
              Field: "@/components/ColorPickerField",
            },
          },
        },
        {
          name: "secondary",
          type: "text",
          label: "Secondary Color",
          defaultValue: "#6c757d",
          admin: {
            components: {
              Field: "@/components/ColorPickerField",
            },
          },
        },
        {
          name: "accent",
          type: "text",
          label: "Accent Color",
          defaultValue: "#28a745",
          admin: {
            components: {
              Field: "@/components/ColorPickerField",
            },
          },
        },
        {
          name: "background",
          type: "text",
          label: "Background Color",
          defaultValue: "#ffffff",
          admin: {
            components: {
              Field: "@/components/ColorPickerField",
            },
          },
        },
        {
          name: "text",
          type: "text",
          label: "Text Color",
          defaultValue: "#333333",
          admin: {
            components: {
              Field: "@/components/ColorPickerField",
            },
          },
        },
        {
          name: "textLight",
          type: "text",
          label: "Light Text Color",
          defaultValue: "#666666",
          admin: {
            components: {
              Field: "@/components/ColorPickerField",
            },
          },
        },
      ],
    },

    {
      name: "globalVariables",
      type: "array",
      label: "Global Variables",
      admin: {
        description:
          "Define global variables that can be used throughout the app (emails, pages, etc.). Use format: {{variable_name}} (no spaces)",
      },
      defaultValue: [
        {
          name: "app_name",
          value: "Your App Name",
          description: "Application name",
          category: "general",
          isSystemGenerated: false,
          isEditable: true,
        },
        {
          name: "site_name",
          value: "Your App Name",
          description: "Site name (alias for app_name)",
          category: "general",
          isSystemGenerated: false,
          isEditable: true,
        },
        {
          name: "user_name",
          value: "John Doe",
          description: "Current user's full name (filled by system)",
          category: "user",
          isSystemGenerated: true,
          isEditable: false,
        },
        {
          name: "user_email",
          value: "user@example.com",
          description: "Current user's email address (filled by system)",
          category: "user",
          isSystemGenerated: true,
          isEditable: false,
        },
        {
          name: "support_email",
          value: "support@yourapp.com",
          description: "Support email address",
          category: "contact",
          isSystemGenerated: false,
          isEditable: true,
        },
        {
          name: "website_url",
          value: "https://yourapp.com",
          description: "Main website URL",
          category: "general",
          isSystemGenerated: false,
          isEditable: true,
        },
        {
          name: "current_year",
          value: new Date().getFullYear().toString(),
          description: "Current year (automatically updated)",
          category: "system",
          isSystemGenerated: true,
          isEditable: false,
        },
      ],
      fields: [
        {
          name: "name",
          type: "text",
          required: true,
          admin: {
            description:
              "Variable name (without curly braces, no spaces). Format: {{variable_name}}",
            placeholder: "app_name",
          },
          validate: (value: any) => {
            if (value && !/^[a-zA-Z][a-zA-Z0-9_]*$/.test(value)) {
              return "Variable name must start with a letter and contain only letters, numbers, and underscores (no spaces)";
            }
            return true;
          },
        },
        {
          name: "value",
          type: "text",
          required: true,
          admin: {
            description: "The value this variable represents",
            placeholder: "My Awesome App",
            condition: (data: any, siblingData: any) =>
              siblingData?.isEditable !== false,
          },
        },
        {
          name: "description",
          type: "text",
          admin: {
            description:
              "Description of what this variable represents and how it's used",
            placeholder: "The name of the application displayed in emails",
          },
        },
        {
          name: "category",
          type: "select",
          options: [
            { label: "General App Info", value: "general" },
            { label: "Contact Information", value: "contact" },
            { label: "User Data (System)", value: "user" },
            { label: "System Generated", value: "system" },
            { label: "Social Media", value: "social" },
            { label: "Legal/Compliance", value: "legal" },
          ],
          defaultValue: "general",
          admin: {
            description: "Category helps organize variables by their purpose",
          },
        },
        {
          name: "isSystemGenerated",
          type: "checkbox",
          label: "System Generated",
          defaultValue: false,
          admin: {
            description:
              "If checked, this variable is automatically filled by the system (e.g., user_name, current_year)",
            readOnly: true,
          },
        },
        {
          name: "isEditable",
          type: "checkbox",
          label: "User Editable",
          defaultValue: true,
          admin: {
            description:
              "If unchecked, users cannot modify this variable's value",
          },
        },
        {
          name: "usageExample",
          type: "ui",
          label: "Usage in Templates",
          admin: {
            components: {
              Field: "@/components/VariableUsageField",
            },
          },
        },
      ],
    },
    {
      name: "emailPreview",
      type: "ui",
      label: "Email Preview",
      admin: {
        components: {
          Field: "@/components/EmailPreview",
        },
      },
    },
    {
      name: "contact",
      type: "group",
      label: "Contact Information",
      fields: [
        {
          name: "supportEmail",
          type: "email",
          label: "Support Email",
          required: true,
        },
        {
          name: "phone",
          type: "text",
          label: "Phone Number",
        },
        {
          name: "address",
          type: "textarea",
          label: "Physical Address",
        },
        {
          name: "website",
          type: "text",
          label: "Website URL",
          validate: (value: any) => {
            if (value && !/^https?:\/\/.+/.test(value)) {
              return "Please enter a valid URL starting with http:// or https://";
            }
            return true;
          },
        },
      ],
    },
    {
      name: "socialLinks",
      type: "array",
      label: "Social Media Links",
      fields: [
        {
          name: "platform",
          type: "select",
          label: "Platform",
          options: [
            { label: "Facebook", value: "facebook" },
            { label: "Twitter/X", value: "twitter" },
            { label: "Instagram", value: "instagram" },
            { label: "LinkedIn", value: "linkedin" },
            { label: "YouTube", value: "youtube" },
            { label: "TikTok", value: "tiktok" },
            { label: "Discord", value: "discord" },
            { label: "GitHub", value: "github" },
          ],
          required: true,
        },
        {
          name: "url",
          type: "text",
          label: "Profile URL",
          required: true,
          validate: (value: any) => {
            if (value && !/^https?:\/\/.+/.test(value)) {
              return "Please enter a valid URL starting with http:// or https://";
            }
            return true;
          },
        },
      ],
    },
    {
      name: "emailTypography",
      type: "group",
      label: "Email Typography Settings",
      admin: {
        description: "Configure fonts and typography for emails and website",
      },
      fields: [
        {
          name: "primaryFont",
          type: "relationship",
          relationTo: "typography",
          admin: {
            description: "Primary font for headings and important text",
          },
          filterOptions: {
            category: { equals: "primary" },
            isActive: { equals: true },
          },
        },
        {
          name: "secondaryFont",
          type: "relationship",
          relationTo: "typography",
          admin: {
            description: "Secondary font for body text and paragraphs",
          },
          filterOptions: {
            category: { equals: "secondary" },
            isActive: { equals: true },
          },
        },
        {
          name: "accentFont",
          type: "relationship",
          relationTo: "typography",
          admin: {
            description: "Accent font for special text and callouts",
          },
          filterOptions: {
            category: { equals: "accent" },
            isActive: { equals: true },
          },
        },
        {
          name: "headingSize",
          type: "select",
          label: "Email Heading Size",
          options: [
            { label: "24px", value: "24" },
            { label: "28px", value: "28" },
            { label: "32px", value: "32" },
            { label: "36px", value: "36" },
            { label: "40px", value: "40" },
          ],
          defaultValue: "32",
          admin: {
            description: "Default heading size for emails",
          },
        },
        {
          name: "bodySize",
          type: "select",
          label: "Email Body Size",
          options: [
            { label: "14px", value: "14" },
            { label: "16px", value: "16" },
            { label: "18px", value: "18" },
            { label: "20px", value: "20" },
          ],
          defaultValue: "16",
          admin: {
            description: "Default body text size for emails",
          },
        },
        {
          name: "lineHeight",
          type: "number",
          label: "Email Line Height",
          min: 1,
          max: 2.5,
          defaultValue: 1.6,
          admin: {
            description: "Line height for email text (1.6 recommended)",
          },
        },
        {
          name: "paragraphSpacing",
          type: "number",
          label: "Email Paragraph Spacing",
          min: 0,
          max: 40,
          defaultValue: 16,
          admin: {
            description: "Spacing between paragraphs in pixels",
          },
        },
      ],
    },
    {
      name: "emailSettings",
      type: "group",
      label: "Email Settings",
      fields: [
        {
          name: "showUnsubscribeLink",
          type: "checkbox",
          label: "Show Unsubscribe Link",
          defaultValue: true,
        },
        {
          name: "showPreferencesLink",
          type: "checkbox",
          label: "Show Preferences Link",
          defaultValue: true,
        },
        {
          name: "includeViewInBrowser",
          type: "checkbox",
          label: 'Include "View in Browser" Link',
          defaultValue: false,
        },
      ],
    },
    {
      name: "isActive",
      type: "checkbox",
      label: "Active Configuration",
      defaultValue: true,
      admin: {
        description:
          "Set as the active branding configuration for the entire app",
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }: any) => {
        // Ensure only one active configuration exists
        if (data?.isActive && operation === "create") {
          // This would need to be implemented with a proper database query
          // to deactivate other configurations
        }
        return data;
      },
    ],
  },
};

export default AppBranding;
