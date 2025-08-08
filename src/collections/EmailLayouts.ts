import type { CollectionConfig } from "payload";

export const EmailLayouts: CollectionConfig = {
  slug: "email-layouts",
  admin: {
    useAsTitle: "name",
    group: "Email System",
    description: "Manage email header and footer layouts",
    defaultColumns: ["name", "description", "isDefault", "isActive"],
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
      admin: {
        description: "Layout name for identification",
      },
    },
    {
      name: "description",
      type: "textarea",
      admin: {
        description: "Description of this layout configuration",
      },
    },
    {
      type: "tabs",
      label: "Layout Configuration",
      tabs: [
        {
          label: "Header",
          fields: [
            {
              name: "headerEnabled",
              type: "checkbox",
              label: "Enable Header",
              defaultValue: true,
            },
            {
              name: "headerLayout",
              type: "select",
              label: "Header Layout",
              options: [
                { label: "Logo + App Name (Centered)", value: "logo-center" },
                {
                  label: "Logo Left, App Name Right",
                  value: "logo-left-name-right",
                },
                { label: "Logo Only (Centered)", value: "logo-only" },
                { label: "App Name Only (Centered)", value: "name-only" },
                { label: "Custom HTML", value: "custom" },
              ],
              defaultValue: "logo-center",
              admin: {
                condition: (data: any, siblingData: any) =>
                  siblingData?.headerEnabled,
              },
            },
            {
              name: "headerBackgroundColor",
              type: "text",
              label: "Background Color",
              defaultValue: "#007bff",
              admin: {
                components: {
                  Field: "@/components/ColorPickerField",
                },
                condition: (data: any, siblingData: any) =>
                  siblingData?.headerEnabled,
              },
            },
            {
              name: "headerTextColor",
              type: "text",
              label: "Text Color",
              defaultValue: "#ffffff",
              admin: {
                components: {
                  Field: "@/components/ColorPickerField",
                },
                condition: (data, siblingData) => siblingData?.headerEnabled,
              },
            },
            {
              type: "row",
              admin: {
                condition: (data: any, siblingData: any) =>
                  siblingData?.headerEnabled,
              },
              fields: [
                {
                  name: "headerPaddingTop",
                  type: "number",
                  label: "Top (px)",
                  defaultValue: 30,
                  admin: {
                    width: "25%",
                  },
                },
                {
                  name: "headerPaddingBottom",
                  type: "number",
                  label: "Bottom (px)",
                  defaultValue: 30,
                  admin: {
                    width: "25%",
                  },
                },
                {
                  name: "headerPaddingLeft",
                  type: "number",
                  label: "Left (px)",
                  defaultValue: 20,
                  admin: {
                    width: "25%",
                  },
                },
                {
                  name: "headerPaddingRight",
                  type: "number",
                  label: "Right (px)",
                  defaultValue: 20,
                  admin: {
                    width: "25%",
                  },
                },
              ],
            },
            {
              name: "headerBorder",
              type: "group",
              label: "Border Settings",
              admin: {
                condition: (data: any, siblingData: any) =>
                  siblingData?.headerEnabled,
              },
              fields: [
                {
                  name: "headerTopBorderEnabled",
                  type: "checkbox",
                  label: "Enable Top Border",
                  defaultValue: false,
                },
                {
                  name: "headerBottomBorderEnabled",
                  type: "checkbox",
                  label: "Enable Bottom Border",
                  defaultValue: false,
                },
                {
                  type: "row",
                  admin: {
                    condition: (data: any, siblingData: any) =>
                      siblingData?.headerTopBorderEnabled ||
                      siblingData?.headerBottomBorderEnabled,
                  },
                  fields: [
                    {
                      name: "headerBorderWidth",
                      type: "number",
                      label: "Border Width (px)",
                      defaultValue: 1,
                      admin: {
                        width: "33%",
                      },
                    },
                    {
                      name: "headerBorderColor",
                      type: "text",
                      label: "Border Color",
                      defaultValue: "#e9ecef",
                      admin: {
                        width: "33%",
                        components: {
                          Field: "@/components/ColorPickerField",
                        },
                      },
                    },
                    {
                      name: "headerBorderStyle",
                      type: "select",
                      label: "Border Style",
                      defaultValue: "solid",
                      options: [
                        { label: "Solid", value: "solid" },
                        { label: "Dashed", value: "dashed" },
                        { label: "Dotted", value: "dotted" },
                      ],
                      admin: {
                        width: "34%",
                      },
                    },
                  ],
                },
              ],
            },
            {
              name: "logoSettings",
              type: "group",
              label: "Logo Settings",
              admin: {
                condition: (data: any, siblingData: any) =>
                  siblingData?.headerEnabled &&
                  siblingData?.headerLayout &&
                  ["logo-center", "logo-left-name-right", "logo-only"].includes(
                    siblingData.headerLayout
                  ),
              },
              fields: [
                {
                  name: "maxWidth",
                  type: "number",
                  label: "Max Width (px)",
                  defaultValue: 200,
                },
                {
                  name: "maxHeight",
                  type: "number",
                  label: "Max Height (px)",
                  defaultValue: 60,
                },
              ],
            },
            {
              name: "headerCustomHtml",
              type: "textarea",
              label: "Custom HTML",
              admin: {
                description:
                  "Custom HTML for header (supports variables like {{app_name}}, {{logo_url}})",
                condition: (data: any, siblingData: any) =>
                  siblingData?.headerEnabled &&
                  siblingData?.headerLayout === "custom",
              },
            },
          ],
        },
        {
          label: "Footer",
          fields: [
            {
              name: "footerEnabled",
              type: "checkbox",
              label: "Enable Footer",
              defaultValue: true,
            },
            {
              name: "footerLayout",
              type: "select",
              label: "Footer Layout",
              options: [
                {
                  label: "Standard (Social + Contact + Legal)",
                  value: "standard",
                },
                { label: "Minimal (Contact + Legal)", value: "minimal" },
                { label: "Social Only", value: "social-only" },
                { label: "Custom HTML", value: "custom" },
              ],
              defaultValue: "standard",
              admin: {
                condition: (data: any, siblingData: any) =>
                  siblingData?.footerEnabled,
              },
            },
            {
              name: "footerBackgroundColor",
              type: "text",
              label: "Background Color",
              defaultValue: "#f8f9fa",
              admin: {
                components: {
                  Field: "@/components/ColorPickerField",
                },
                condition: (data, siblingData) => siblingData?.footerEnabled,
              },
            },
            {
              name: "footerTextColor",
              type: "text",
              label: "Text Color",
              defaultValue: "#666666",
              admin: {
                components: {
                  Field: "@/components/ColorPickerField",
                },
                condition: (data, siblingData) => siblingData?.footerEnabled,
              },
            },

            {
              type: "row",
              admin: {
                condition: (data, siblingData) => siblingData?.footerEnabled,
              },
              fields: [
                {
                  name: "footerPaddingTop",
                  type: "number",
                  label: "Top (px)",
                  defaultValue: 20,
                  admin: {
                    width: "25%",
                  },
                },
                {
                  name: "footerPaddingBottom",
                  type: "number",
                  label: "Bottom (px)",
                  defaultValue: 20,
                  admin: {
                    width: "25%",
                  },
                },
                {
                  name: "footerPaddingLeft",
                  type: "number",
                  label: "Left (px)",
                  defaultValue: 20,
                  admin: {
                    width: "25%",
                  },
                },
                {
                  name: "footerPaddingRight",
                  type: "number",
                  label: "Right (px)",
                  defaultValue: 20,
                  admin: {
                    width: "25%",
                  },
                },
              ],
            },
            {
              name: "footerBorder",
              type: "group",
              label: "Border Settings",
              admin: {
                condition: (data, siblingData) => siblingData?.footerEnabled,
              },
              fields: [
                {
                  name: "footerTopBorderEnabled",
                  type: "checkbox",
                  label: "Enable Top Border",
                  defaultValue: true,
                },
                {
                  name: "footerBottomBorderEnabled",
                  type: "checkbox",
                  label: "Enable Bottom Border",
                  defaultValue: false,
                },
                {
                  type: "row",
                  admin: {
                    condition: (data: any, siblingData: any) =>
                      siblingData?.footerTopBorderEnabled ||
                      siblingData?.footerBottomBorderEnabled,
                  },
                  fields: [
                    {
                      name: "footerBorderWidth",
                      type: "number",
                      label: "Border Width (px)",
                      defaultValue: 1,
                      admin: {
                        width: "33%",
                      },
                    },
                    {
                      name: "footerBorderColor",
                      type: "text",
                      label: "Border Color",
                      defaultValue: "#e9ecef",
                      admin: {
                        width: "33%",
                        components: {
                          Field: "@/components/ColorPickerField",
                        },
                      },
                    },
                    {
                      name: "footerBorderStyle",
                      type: "select",
                      label: "Border Style",
                      defaultValue: "solid",
                      options: [
                        { label: "Solid", value: "solid" },
                        { label: "Dashed", value: "dashed" },
                        { label: "Dotted", value: "dotted" },
                      ],
                      admin: {
                        width: "34%",
                      },
                    },
                  ],
                },
              ],
            },
            {
              name: "sections",
              type: "group",
              label: "Footer Sections",
              admin: {
                condition: (data: any, siblingData: any) =>
                  siblingData?.footerEnabled &&
                  siblingData?.footerLayout !== "custom",
              },
              fields: [
                {
                  name: "showSocialLinks",
                  type: "checkbox",
                  label: "Show Social Links",
                  defaultValue: true,
                },
                {
                  name: "showContactInfo",
                  type: "checkbox",
                  label: "Show Contact Information",
                  defaultValue: true,
                },
                {
                  name: "showLegalLinks",
                  type: "checkbox",
                  label: "Show Legal Links (Unsubscribe, Preferences)",
                  defaultValue: true,
                },
                {
                  name: "showCopyright",
                  type: "checkbox",
                  label: "Show Copyright",
                  defaultValue: true,
                },
              ],
            },
            {
              name: "footerCustomHtml",
              type: "textarea",
              label: "Custom HTML",
              admin: {
                description:
                  "Custom HTML for footer (supports all global variables)",
                condition: (data: any, siblingData: any) =>
                  siblingData?.footerEnabled &&
                  siblingData?.footerLayout === "custom",
              },
            },
          ],
        },
        {
          label: "Typography",
          fields: [
            {
              name: "useCustomTypography",
              type: "checkbox",
              label: "Use Custom Typography",
              defaultValue: false,
              admin: {
                description:
                  "Override global typography settings for this layout",
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
                description: "Size for headings in this layout",
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
                description: "Size for body text in this layout",
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
    },
    {
      name: "isDefault",
      type: "checkbox",
      label: "Default Layout",
      defaultValue: false,
      admin: {
        description: "Set as the default layout for new email templates",
      },
    },
    {
      name: "isActive",
      type: "checkbox",
      label: "Active",
      defaultValue: true,
    },
    {
      name: "preview",
      type: "ui",
      admin: {
        position: "sidebar",
        components: {
          Field: "@/components/EmailLayoutPreview",
        },
      },
    },
    {
      name: "variableReference",
      type: "ui",
      label: "Variable Reference",
      admin: {
        position: "sidebar",
        components: {
          Field: "@/components/VariableReference",
        },
        description:
          "Reference for all available variables you can use in headers and footers",
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }: any) => {
        // Ensure only one default layout exists
        if (data.isDefault && operation === "create") {
          // This would need to be implemented with a proper database query
          // to unset other default layouts
        }
        return data;
      },
    ],
  },
};

export default EmailLayouts;
