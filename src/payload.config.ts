// storage-adapter-import-placeholder

import path from "node:path";
import { fileURLToPath } from "node:url";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { getEmailAdapter } from "./app/(payload)/emails/email";
import { emailService } from "./app/(payload)/emails/emailService";
import { seedDefaultRoles, seedEmailTemplates } from "./lib/seed";
import { payloadCloudPlugin } from "@payloadcms/payload-cloud";
import { formBuilderPlugin } from "@payloadcms/plugin-form-builder";
import { nestedDocsPlugin } from "@payloadcms/plugin-nested-docs";
import { seoPlugin } from "@payloadcms/plugin-seo";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import { ar } from "payload/i18n/ar";
import { de } from "payload/i18n/de";
// Import language files
import { en } from "payload/i18n/en";
import { es } from "payload/i18n/es";
import { fr } from "payload/i18n/fr";
import sharp from "sharp";
import EmailSettings from "./collections/EmailSettings";
import { Media } from "./collections/Media";
import { Pages } from "./collections/Pages";
import { Roles } from "./collections/Roles";
import { Users } from "./collections/Users";
import { AppBranding } from "./collections/AppBranding";
import { EmailTemplates } from "./collections/EmailTemplates";
import { EmailLayouts } from "./collections/EmailLayouts";
import { GlobalVariables } from "./collections/GlobalVariables";
import { Typography } from "./collections/Typography";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Users,
    Media,
    Roles,
    EmailSettings,
    Pages,
    AppBranding,
    EmailTemplates,
    EmailLayouts,
    GlobalVariables,
    Typography,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || "",
    },
  }),
  // Email configuration will be handled dynamically through EmailSettings collection
  // i18n configuration for admin interface
  i18n: {
    supportedLanguages: { en, es, fr, de, ar },
  },
  // Localization configuration for content
  localization: {
    locales: [
      {
        label: "English",
        code: "en",
      },
      {
        label: "Spanish",
        code: "es",
      },
      {
        label: "French",
        code: "fr",
      },
    ],
    defaultLocale: "en",
    fallback: true,
  },
  sharp,
  onInit: async (payload) => {
    // Initialize email service
    emailService.setPayload(payload);
    await emailService.refreshEmailAdapter();
    await seedDefaultRoles(payload);
    await seedEmailTemplates(payload);
  },
  plugins: [
    payloadCloudPlugin(),
    seoPlugin({
      collections: [
        "pages", // Enable SEO for the Pages collection
        // Add more collection slugs here as needed
        // Example: 'posts', 'articles'
      ],
      uploadsCollection: "media",
      generateTitle: ({ doc }) => {
        // Customize title generation based on your needs
        return doc?.title ? `${doc.title} | Your Site Name` : "Your Site Name";
      },
      generateDescription: ({ doc }) => {
        // Customize description generation based on your needs
        return doc?.excerpt || doc?.description || "Default site description";
      },
      tabbedUI: true,
    }),
    formBuilderPlugin({
      fields: {
        text: true,
        textarea: true,
        select: true,
        email: true,
        state: true,
        country: true,
        checkbox: true,
        number: true,
        message: true,
        date: true,
        payment: false, // Disable payment field for now
      },
      redirectRelationships: ["pages"], // Allow redirecting to pages after form submission
    }),
    nestedDocsPlugin({
      collections: ["pages"], // Enable nested docs for Pages collection
      generateLabel: (_, doc) => (doc.title as string) || (doc.id as string), // Use title as breadcrumb label
      generateURL: (docs) => {
        // Generate hierarchical URLs like /parent/child/grandchild
        return docs.reduce((url, doc) => `${url}/${doc.slug as string}`, "");
      },
    }),
    // storage-adapter-placeholder
  ],
});
