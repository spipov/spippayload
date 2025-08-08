import type { CollectionConfig } from "payload";

export const Typography: CollectionConfig = {
  slug: "typography",
  admin: {
    useAsTitle: "name",
    group: "Branding",
    description:
      "Manage custom fonts and typography settings for emails and website",
    defaultColumns: ["name", "fontFamily", "isActive", "usage"],
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
      unique: true,
      admin: {
        description: "Descriptive name for this font configuration",
        placeholder: "Primary Brand Font",
      },
    },
    {
      name: "fontFamily",
      type: "text",
      required: true,
      admin: {
        description: "CSS font-family name (will be used in CSS)",
        placeholder: "Inter, Arial, sans-serif",
      },
    },
    {
      name: "displayName",
      type: "text",
      required: true,
      admin: {
        description: "Human-readable font name",
        placeholder: "Inter Regular",
      },
    },
    {
      name: "category",
      type: "select",
      required: true,
      options: [
        { label: "Primary (Headings)", value: "primary" },
        { label: "Secondary (Body Text)", value: "secondary" },
        { label: "Accent (Special Text)", value: "accent" },
        { label: "Monospace (Code)", value: "monospace" },
      ],
      defaultValue: "primary",
      admin: {
        description: "Font category for organization and usage",
      },
    },
    {
      name: "usage",
      type: "select",
      required: true,
      hasMany: true,
      options: [
        { label: "Email Templates", value: "email" },
        { label: "Website Frontend", value: "frontend" },
        { label: "Admin Interface", value: "admin" },
      ],
      defaultValue: ["email"],
      admin: {
        description: "Where this font can be used",
      },
    },
    {
      name: "fontFiles",
      type: "group",
      label: "Font Files",
      admin: {
        description:
          "Upload custom font files (WOFF2 recommended for best performance)",
      },
      fields: [
        {
          name: "woff2",
          type: "upload",
          relationTo: "media",
          admin: {
            description: "WOFF2 font file (recommended - best compression)",
          },
          filterOptions: {
            and: [
              { mimeType: { contains: "font" } },
              { folder: { equals: "fonts" } },
            ],
          },
        },
        {
          name: "woff",
          type: "upload",
          relationTo: "media",
          admin: {
            description: "WOFF font file (fallback for older browsers)",
          },
          filterOptions: {
            and: [
              { mimeType: { contains: "font" } },
              { folder: { equals: "fonts" } },
            ],
          },
        },
        {
          name: "ttf",
          type: "upload",
          relationTo: "media",
          admin: {
            description: "TTF font file (fallback)",
          },
          filterOptions: {
            and: [
              { mimeType: { contains: "font" } },
              { folder: { equals: "fonts" } },
            ],
          },
        },
      ],
    },
    {
      name: "webSafeFallbacks",
      type: "textarea",
      required: true,
      defaultValue: "Arial, Helvetica, sans-serif",
      admin: {
        description: "Web-safe fallback fonts (comma-separated)",
        placeholder: "Arial, Helvetica, sans-serif",
      },
    },
    {
      name: "fontWeights",
      type: "array",
      label: "Available Font Weights",
      admin: {
        description: "Define which font weights are available for this font",
      },
      fields: [
        {
          name: "weight",
          type: "select",
          required: true,
          options: [
            { label: "100 - Thin", value: "100" },
            { label: "200 - Extra Light", value: "200" },
            { label: "300 - Light", value: "300" },
            { label: "400 - Regular", value: "400" },
            { label: "500 - Medium", value: "500" },
            { label: "600 - Semi Bold", value: "600" },
            { label: "700 - Bold", value: "700" },
            { label: "800 - Extra Bold", value: "800" },
            { label: "900 - Black", value: "900" },
          ],
        },
        {
          name: "name",
          type: "text",
          required: true,
          admin: {
            placeholder: "Regular, Bold, Light, etc.",
          },
        },
        {
          name: "isDefault",
          type: "checkbox",
          label: "Default Weight",
          admin: {
            description: "Use this weight as the default for this font",
          },
        },
      ],
    },
    {
      name: "emailSettings",
      type: "group",
      label: "Email-Specific Settings",
      admin: {
        description: "Typography settings optimized for email clients",
      },
      fields: [
        {
          name: "lineHeight",
          type: "number",
          min: 1,
          max: 3,
          step: 0.1,
          defaultValue: 1.4,
          admin: {
            description: "Line height for email text (1.4 recommended)",
          },
        },
        {
          name: "letterSpacing",
          type: "number",
          min: -2,
          max: 5,
          step: 0.1,
          defaultValue: 0,
          admin: {
            description: "Letter spacing in pixels",
          },
        },
        {
          name: "emailFallback",
          type: "text",
          defaultValue: "Arial, sans-serif",
          admin: {
            description:
              "Email client fallback (for clients that don't support web fonts)",
          },
        },
      ],
    },
    {
      name: "cssPreview",
      type: "ui",
      admin: {
        components: {
          Field: "@/components/FontPreview",
        },
        description: "Preview how this font will look",
      },
    },
    {
      name: "isActive",
      type: "checkbox",
      label: "Active",
      defaultValue: true,
      admin: {
        description: "Whether this font is available for use",
      },
    },
    {
      name: "notes",
      type: "textarea",
      admin: {
        description:
          "Internal notes about this font (licensing, usage guidelines, etc.)",
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        // Ensure only one default weight per font
        if (data.fontWeights) {
          const defaultWeights = data.fontWeights.filter(
            (w: any) => w.isDefault
          );
          if (defaultWeights.length > 1) {
            // Keep only the first default, remove others
            data.fontWeights = data.fontWeights.map(
              (w: any, index: number) => ({
                ...w,
                isDefault:
                  index ===
                  data.fontWeights.findIndex((fw: any) => fw.isDefault),
              })
            );
          }
        }

        return data;
      },
    ],
    afterChange: [
      ({ doc, operation }) => {
        console.log(`Typography "${doc.name}" was ${operation}d`);
      },
    ],
  },
};

export default Typography;
