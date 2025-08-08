import type { CollectionConfig } from "payload";
import { canManageMedia } from "../lib/access";

export const Media: CollectionConfig = {
  slug: "media",
  admin: {
    useAsTitle: "filename",
    defaultColumns: ["filename", "folder", "fileType", "alt", "updatedAt"],
    group: "Collections",
    description:
      "Manage all media files with automatic organization by type and folder",
    pagination: {
      defaultLimit: 20,
    },
  },
  access: {
    create: canManageMedia,
    read: () => true,
    update: canManageMedia,
    delete: canManageMedia,
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
      localized: true,
    },
    {
      name: "caption",
      type: "text",
      localized: true,
    },
    {
      name: "folder",
      type: "select",
      admin: {
        description: "Organize files into folders for better management",
        position: "sidebar",
      },
      options: [
        { label: "Root", value: "" },
        { label: "Images", value: "images" },
        { label: "Fonts", value: "fonts" },
        { label: "Documents", value: "documents" },
        { label: "Audio", value: "audio" },
        { label: "Video", value: "video" },
        { label: "Email Assets", value: "email-assets" },
        { label: "Website Assets", value: "website-assets" },
        { label: "App Assets", value: "app-assets" },
        { label: "System", value: "system" },
        { label: "Other", value: "other" },
      ],
      defaultValue: "",
    },
    {
      name: "fileType",
      type: "select",
      admin: {
        readOnly: true,
        description: "Automatically detected file type",
        position: "sidebar",
      },
      options: [
        { label: "Image", value: "image" },
        { label: "Font", value: "font" },
        { label: "Document", value: "document" },
        { label: "Audio", value: "audio" },
        { label: "Video", value: "video" },
        { label: "Other", value: "other" },
      ],
    },
    {
      name: "tags",
      type: "text",
      admin: {
        description:
          "Comma-separated tags for better searchability (e.g., logo, header, woff2)",
        placeholder: "logo, header, primary-font",
        position: "sidebar",
      },
    },
    {
      name: "usage",
      type: "select",
      hasMany: true,
      admin: {
        description: "Where this file is intended to be used",
        position: "sidebar",
      },
      options: [
        { label: "Email Templates", value: "email" },
        { label: "Website", value: "website" },
        { label: "Mobile App", value: "mobile" },
        { label: "Print", value: "print" },
        { label: "Social Media", value: "social" },
        { label: "Branding", value: "branding" },
      ],
    },
  ],
  upload: {
    staticDir: "media",
    adminThumbnail: ({ doc }: any) => {
      // Don't show thumbnails for font files
      if (doc.mimeType?.startsWith("font/")) {
        return null;
      }
      return `${process.env.PAYLOAD_PUBLIC_SERVER_URL}/media/${doc.filename}`;
    },
    mimeTypes: [
      // Images
      "image/*",
      // Fonts
      "font/woff2",
      "font/woff",
      "font/ttf",
      "font/otf",
      "application/font-woff2",
      "application/font-woff",
      "application/x-font-ttf",
      "application/x-font-truetype",
      "application/x-font-opentype",
      // Documents
      "application/pdf",
      "text/*",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      // Audio
      "audio/*",
      // Video
      "video/*",
      // Archives
      "application/zip",
      "application/x-rar-compressed",
    ],
    imageSizes: [
      {
        name: "thumbnail",
        width: 150,
        height: 150,
        position: "centre",
      },
      {
        name: "card",
        width: 400,
        height: 300,
        position: "centre",
      },
      {
        name: "tablet",
        width: 768,
        height: undefined,
        position: "centre",
      },
      {
        name: "desktop",
        width: 1200,
        height: undefined,
        position: "centre",
      },
    ],
  },
  hooks: {
    beforeChange: [
      ({ data, req, operation }) => {
        // Auto-detect file type and suggest folder based on MIME type
        if (data.mimeType) {
          if (data.mimeType.startsWith("image/")) {
            data.fileType = "image";
            // Auto-suggest folder if not set
            if (!data.folder && operation === "create") {
              data.folder = "images";
            }
          } else if (
            data.mimeType.startsWith("font/") ||
            data.mimeType.includes("font")
          ) {
            data.fileType = "font";
            if (!data.folder && operation === "create") {
              data.folder = "fonts";
            }
            // Auto-suggest usage for fonts
            if (!data.usage || data.usage.length === 0) {
              data.usage = ["email", "website"];
            }
          } else if (
            data.mimeType === "application/pdf" ||
            data.mimeType.startsWith("text/") ||
            data.mimeType.includes("document")
          ) {
            data.fileType = "document";
            if (!data.folder && operation === "create") {
              data.folder = "documents";
            }
          } else if (data.mimeType.startsWith("audio/")) {
            data.fileType = "audio";
            if (!data.folder && operation === "create") {
              data.folder = "audio";
            }
          } else if (data.mimeType.startsWith("video/")) {
            data.fileType = "video";
            if (!data.folder && operation === "create") {
              data.folder = "video";
            }
          } else {
            data.fileType = "other";
            if (!data.folder && operation === "create") {
              data.folder = "other";
            }
          }
        }

        // Auto-generate tags based on filename and type
        if (operation === "create" && data.filename && !data.tags) {
          const filename = data.filename.toLowerCase();
          const suggestedTags = [];

          // Add file type as tag
          if (data.fileType) {
            suggestedTags.push(data.fileType);
          }

          // Add file extension as tag
          const extension = filename.split(".").pop();
          if (extension) {
            suggestedTags.push(extension);
          }

          // Suggest tags based on filename patterns
          if (filename.includes("logo")) suggestedTags.push("logo");
          if (filename.includes("header")) suggestedTags.push("header");
          if (filename.includes("footer")) suggestedTags.push("footer");
          if (filename.includes("banner")) suggestedTags.push("banner");
          if (filename.includes("icon")) suggestedTags.push("icon");
          if (filename.includes("background")) suggestedTags.push("background");
          if (filename.includes("avatar")) suggestedTags.push("avatar");
          if (filename.includes("profile")) suggestedTags.push("profile");

          // Font-specific tags
          if (data.fileType === "font") {
            if (filename.includes("bold")) suggestedTags.push("bold");
            if (filename.includes("light")) suggestedTags.push("light");
            if (filename.includes("regular")) suggestedTags.push("regular");
            if (filename.includes("italic")) suggestedTags.push("italic");
          }

          data.tags = suggestedTags.join(", ");
        }

        return data;
      },
    ],
    afterChange: [
      ({ doc, operation }) => {
        // Log file organization for debugging
        if (operation === "create") {
          console.log(
            `New ${doc.fileType} file organized: ${doc.filename} → ${doc.folder || "root"} folder`
          );
        }
      },
    ],
  },
};
