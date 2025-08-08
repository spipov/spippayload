import type { CollectionConfig } from "payload";

export const EmailTemplates: CollectionConfig = {
  slug: "email-templates",
  admin: {
    useAsTitle: "name",
    group: "Email System",
    description: "Manage email templates with variables and branding",
  },
  access: {
    read: () => true,
    create: ({ req: { user } }) => !!user,
    update: ({ req: { user } }) => !!user,
    delete: ({ req: { user } }) => !!user,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
      admin: {
        description: "Internal name for this email template",
      },
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
      admin: {
        description: "Unique identifier for this template (used in code)",
      },
      validate: (value: string) => {
        if (value && !/^[a-z0-9-_]+$/.test(value)) {
          return "Slug can only contain lowercase letters, numbers, hyphens, and underscores";
        }
        return true;
      },
    },
    {
      name: "category",
      type: "select",
      required: true,
      options: [
        { label: "Authentication", value: "auth" },
        { label: "Account Management", value: "account" },
        { label: "System Notifications", value: "system" },
      ],
      admin: {
        description: "Template category for organization",
      },
    },
    {
      name: "subject",
      type: "text",
      required: true,
      admin: {
        description:
          "Email subject line (supports variables like {{appName}}, {{userName}})",
        placeholder: "Welcome to {{appName}}, {{userName}}!",
      },
    },
    {
      name: "preheader",
      type: "text",
      admin: {
        description: "Preview text shown in email clients (supports variables)",
        placeholder: "Get started with your new account...",
      },
    },
    {
      name: "htmlContent",
      type: "richText",
      required: true,
      admin: {
        description:
          "HTML email content (supports variables like {{userName}}, {{verificationLink}}, etc.)",
      },
    },

    // Visual Email Editor
    {
      name: "visualEditor",
      type: "ui",
      label: "Visual Email Editor",
      admin: {
        components: {
          Field: "@/components/EmailTemplateEditor",
        },
        description:
          "Edit your email template with live preview and variable support",
      },
    },
    // Variable Reference
    {
      name: "variableReference",
      type: "ui",
      label: "Variable Reference",
      admin: {
        components: {
          Field: "@/components/VariableReference",
        },
        description:
          "Reference for all available variables you can use in this template",
        position: "sidebar",
      },
    },
    {
      name: "textContent",
      type: "textarea",
      required: true,
      admin: {
        description: "Plain text version of the email (supports variables)",
        placeholder:
          "Hello {{userName}},\n\nWelcome to {{appName}}!\n\nBest regards,\nThe {{appName}} Team",
      },
    },

    {
      name: "branding",
      type: "relationship",
      relationTo: "app-branding",
      admin: {
        description:
          "Branding configuration to use for this template (leave empty to use active default)",
      },
    },
    {
      name: "isActive",
      type: "checkbox",
      defaultValue: true,
      admin: {
        description: "Whether this template is active and can be used",
      },
    },
    {
      name: "testData",
      type: "json",
      admin: {
        description: "Sample data for testing this template (JSON format)",
      },
    },
    {
      type: "collapsible",
      label: "Typography Settings",
      admin: {
        initCollapsed: true,
        description: "Override typography settings for this specific template",
      },
      fields: [
        {
          name: "useCustomTypography",
          type: "checkbox",
          label: "Use Custom Typography",
          defaultValue: false,
          admin: {
            description:
              "Override global and layout typography settings for this template",
          },
        },
        {
          name: "primaryFont",
          type: "relationship",
          relationTo: "typography",
          label: "Primary Font",
          admin: {
            description: "Font for headings and important text",
            condition: (data: any, siblingData: any) =>
              siblingData?.useCustomTypography,
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
          label: "Secondary Font",
          admin: {
            description: "Font for body text and paragraphs",
            condition: (data: any, siblingData: any) =>
              siblingData?.useCustomTypography,
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
          label: "Accent Font",
          admin: {
            description: "Font for special text and callouts",
            condition: (data: any, siblingData: any) =>
              siblingData?.useCustomTypography,
          },
          filterOptions: {
            category: { equals: "accent" },
            isActive: { equals: true },
          },
        },
        {
          name: "headingSize",
          type: "select",
          label: "Heading Size",
          options: [
            { label: "24px", value: "24" },
            { label: "28px", value: "28" },
            { label: "32px", value: "32" },
            { label: "36px", value: "36" },
            { label: "40px", value: "40" },
          ],
          defaultValue: "32",
          admin: {
            description: "Size for headings in this template",
            condition: (data: any, siblingData: any) =>
              siblingData?.useCustomTypography,
          },
        },
        {
          name: "bodySize",
          type: "select",
          label: "Body Text Size",
          options: [
            { label: "14px", value: "14" },
            { label: "16px", value: "16" },
            { label: "18px", value: "18" },
            { label: "20px", value: "20" },
          ],
          defaultValue: "16",
          admin: {
            description: "Size for body text in this template",
            condition: (data: any, siblingData: any) =>
              siblingData?.useCustomTypography,
          },
        },
        {
          name: "lineHeight",
          type: "number",
          label: "Line Height",
          min: 1,
          max: 2.5,
          step: 0.1,
          defaultValue: 1.6,
          admin: {
            description: "Line height for text (1.6 recommended)",
            condition: (data: any, siblingData: any) =>
              siblingData?.useCustomTypography,
          },
        },
      ],
    },
  ],
  hooks: {
    beforeValidate: [
      ({ data }) => {
        // Auto-generate slug from name if not provided
        if (data?.name && !data?.slug) {
          data.slug = data.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");
        }
        return data;
      },
    ],
  },
};

export default EmailTemplates;
