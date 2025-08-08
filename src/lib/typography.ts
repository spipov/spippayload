export interface TypographyFont {
  id: string;
  name: string;
  fontFamily: string;
  displayName: string;
  category: "primary" | "secondary" | "accent" | "monospace";
  usage: ("email" | "frontend" | "admin")[];
  fontFiles?: {
    woff2?: { url: string };
    woff?: { url: string };
    ttf?: { url: string };
  };
  webSafeFallbacks: string;
  fontWeights?: Array<{
    weight: string;
    name: string;
    isDefault: boolean;
  }>;
  emailSettings?: {
    lineHeight: number;
    letterSpacing: number;
    emailFallback: string;
  };
  isActive: boolean;
}

export interface BrandingTypography {
  primaryFont?: TypographyFont;
  secondaryFont?: TypographyFont;
  accentFont?: TypographyFont;
  emailTypography?: {
    headingSize: string;
    bodySize: string;
    lineHeight: number;
    paragraphSpacing: number;
  };
}

/**
 * Generate CSS font-face declarations for custom fonts
 */
export function generateFontFaceCSS(fonts: TypographyFont[]): string {
  let css = "";

  fonts.forEach((font) => {
    if (
      font.fontFiles &&
      (font.fontFiles.woff2 || font.fontFiles.woff || font.fontFiles.ttf)
    ) {
      const fontName = font.fontFamily.split(",")[0].trim();

      // Generate font-face for each weight
      const weights = font.fontWeights || [
        { weight: "400", name: "Regular", isDefault: true },
      ];

      weights.forEach((weight) => {
        const sources = [];
        if (font.fontFiles?.woff2) {
          sources.push(`url('${font.fontFiles.woff2.url}') format('woff2')`);
        }
        if (font.fontFiles?.woff) {
          sources.push(`url('${font.fontFiles.woff.url}') format('woff')`);
        }
        if (font.fontFiles?.ttf) {
          sources.push(`url('${font.fontFiles.ttf.url}') format('truetype')`);
        }

        if (sources.length > 0) {
          css += `
@font-face {
  font-family: '${fontName}';
  src: ${sources.join(", ")};
  font-weight: ${weight.weight};
  font-display: swap;
}
`;
        }
      });
    }
  });

  return css;
}

/**
 * Generate email-safe CSS with fallbacks
 */
export function generateEmailCSS(typography: BrandingTypography): string {
  const { primaryFont, secondaryFont, accentFont, emailTypography } =
    typography;

  const primaryFontStack = primaryFont
    ? `${primaryFont.fontFamily}, ${primaryFont.webSafeFallbacks}`
    : "Arial, Helvetica, sans-serif";

  const secondaryFontStack = secondaryFont
    ? `${secondaryFont.fontFamily}, ${secondaryFont.webSafeFallbacks}`
    : "Arial, Helvetica, sans-serif";

  const accentFontStack = accentFont
    ? `${accentFont.fontFamily}, ${accentFont.webSafeFallbacks}`
    : "Arial, Helvetica, sans-serif";

  const headingSize = emailTypography?.headingSize || "32";
  const bodySize = emailTypography?.bodySize || "16";
  const lineHeight = emailTypography?.lineHeight || 1.6;
  const paragraphSpacing = emailTypography?.paragraphSpacing || 16;

  return `
/* Email Typography Styles */
.email-heading, h1, h2, h3, h4, h5, h6 {
  font-family: ${primaryFontStack};
  font-size: ${headingSize}px;
  line-height: ${lineHeight};
  margin: 0 0 ${paragraphSpacing}px 0;
  font-weight: ${primaryFont?.fontWeights?.find((w) => w.isDefault)?.weight || "700"};
}

.email-body, p, div, span, td {
  font-family: ${secondaryFontStack};
  font-size: ${bodySize}px;
  line-height: ${lineHeight};
  margin: 0 0 ${paragraphSpacing}px 0;
  font-weight: ${secondaryFont?.fontWeights?.find((w) => w.isDefault)?.weight || "400"};
}

.email-accent, .accent {
  font-family: ${accentFontStack};
  font-weight: ${accentFont?.fontWeights?.find((w) => w.isDefault)?.weight || "500"};
}

/* Email client specific overrides */
.email-container {
  font-family: ${secondaryFontStack};
  font-size: ${bodySize}px;
  line-height: ${lineHeight};
}

/* Outlook specific */
<!--[if mso]>
<style type="text/css">
  .email-heading, h1, h2, h3, h4, h5, h6 {
    font-family: ${primaryFont?.emailSettings?.emailFallback || "Arial, sans-serif"} !important;
  }
  .email-body, p, div, span, td {
    font-family: ${secondaryFont?.emailSettings?.emailFallback || "Arial, sans-serif"} !important;
  }
</style>
<![endif]-->
`;
}

/**
 * Generate web CSS for frontend use
 */
export function generateWebCSS(typography: BrandingTypography): string {
  const { primaryFont, secondaryFont, accentFont, emailTypography } =
    typography;

  const primaryFontStack = primaryFont
    ? `${primaryFont.fontFamily}, ${primaryFont.webSafeFallbacks}`
    : "system-ui, -apple-system, sans-serif";

  const secondaryFontStack = secondaryFont
    ? `${secondaryFont.fontFamily}, ${secondaryFont.webSafeFallbacks}`
    : "system-ui, -apple-system, sans-serif";

  const accentFontStack = accentFont
    ? `${accentFont.fontFamily}, ${accentFont.webSafeFallbacks}`
    : "system-ui, -apple-system, sans-serif";

  return `
/* Web Typography Styles */
:root {
  --font-primary: ${primaryFontStack};
  --font-secondary: ${secondaryFontStack};
  --font-accent: ${accentFontStack};
  --font-primary-weight: ${primaryFont?.fontWeights?.find((w) => w.isDefault)?.weight || "700"};
  --font-secondary-weight: ${secondaryFont?.fontWeights?.find((w) => w.isDefault)?.weight || "400"};
  --font-accent-weight: ${accentFont?.fontWeights?.find((w) => w.isDefault)?.weight || "500"};
}

h1, h2, h3, h4, h5, h6, .heading {
  font-family: var(--font-primary);
  font-weight: var(--font-primary-weight);
}

body, p, div, span, .body-text {
  font-family: var(--font-secondary);
  font-weight: var(--font-secondary-weight);
}

.accent, .accent-text {
  font-family: var(--font-accent);
  font-weight: var(--font-accent-weight);
}
`;
}

/**
 * Fetch typography configuration from branding
 */
export async function getTypographyFromBranding(
  payload: any
): Promise<BrandingTypography | null> {
  try {
    const brandingResult = await payload.find({
      collection: "app-branding",
      where: { isActive: { equals: true } },
      limit: 1,
      depth: 2, // Include related typography documents
    });

    const branding = brandingResult.docs[0];
    if (!branding?.emailTypography) return null;

    return {
      primaryFont: branding.emailTypography.primaryFont,
      secondaryFont: branding.emailTypography.secondaryFont,
      accentFont: branding.emailTypography.accentFont,
      emailTypography: {
        headingSize: branding.emailTypography.headingSize,
        bodySize: branding.emailTypography.bodySize,
        lineHeight: branding.emailTypography.lineHeight,
        paragraphSpacing: branding.emailTypography.paragraphSpacing,
      },
    };
  } catch (error) {
    console.error("Error fetching typography from branding:", error);
    return null;
  }
}

/**
 * Get typography configuration with hierarchy: template > layout > global
 */
export async function getTypographyForEmail(
  payload: any,
  templateId?: string,
  layoutId?: string
): Promise<BrandingTypography | null> {
  try {
    let typography = null;

    // 1. Try template-specific typography first
    if (templateId) {
      const templateResult = await payload.findByID({
        collection: "email-templates",
        id: templateId,
        depth: 2,
      });

      if (templateResult?.useCustomTypography) {
        typography = {
          primaryFont: templateResult.primaryFont,
          secondaryFont: templateResult.secondaryFont,
          accentFont: templateResult.accentFont,
          emailTypography: {
            headingSize: templateResult.headingSize,
            bodySize: templateResult.bodySize,
            lineHeight: templateResult.lineHeight,
            paragraphSpacing: templateResult.paragraphSpacing,
          },
        };
      }
    }

    // 2. Try layout-specific typography if no template typography
    if (!typography && layoutId) {
      const layoutResult = await payload.findByID({
        collection: "email-layouts",
        id: layoutId,
        depth: 2,
      });

      if (layoutResult?.useCustomTypography) {
        typography = {
          primaryFont: layoutResult.primaryFont,
          secondaryFont: layoutResult.secondaryFont,
          accentFont: layoutResult.accentFont,
          emailTypography: {
            headingSize: layoutResult.headingSize,
            bodySize: layoutResult.bodySize,
            lineHeight: layoutResult.lineHeight,
            paragraphSpacing: layoutResult.paragraphSpacing,
          },
        };
      }
    }

    // 3. Fall back to global branding typography
    if (!typography) {
      typography = await getTypographyFromBranding(payload);
    }

    return typography;
  } catch (error) {
    console.error("Error fetching typography for email:", error);
    return null;
  }
}

/**
 * Get all active fonts for a specific usage
 */
export async function getFontsByUsage(
  payload: any,
  usage: "email" | "frontend" | "admin"
): Promise<TypographyFont[]> {
  try {
    const result = await payload.find({
      collection: "typography",
      where: {
        and: [{ isActive: { equals: true } }, { usage: { contains: usage } }],
      },
      limit: 100,
    });

    return result.docs || [];
  } catch (error) {
    console.error(`Error fetching fonts for ${usage}:`, error);
    return [];
  }
}

/**
 * Generate complete typography CSS for emails
 */
export async function generateEmailTypographyCSS(
  payload: any
): Promise<string> {
  const typography = await getTypographyFromBranding(payload);
  if (!typography) return "";

  const fonts = [
    typography.primaryFont,
    typography.secondaryFont,
    typography.accentFont,
  ].filter(Boolean) as TypographyFont[];

  const fontFaceCSS = generateFontFaceCSS(fonts);
  const emailCSS = generateEmailCSS(typography);

  return fontFaceCSS + emailCSS;
}
