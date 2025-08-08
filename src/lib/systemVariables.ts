export interface SystemVariable {
  name: string;
  displayName: string;
  description: string;
  category: "system" | "user" | "app" | "date" | "contact" | "url";
  example: string;
  isRequired: boolean;
  dataType: "string" | "number" | "date" | "url" | "email";
}

/**
 * System-defined variables that are always available in all email templates
 * These variables are automatically populated by the system
 */
export const SYSTEM_VARIABLES: SystemVariable[] = [
  // App/Company Variables
  {
    name: "app_name",
    displayName: "App Name",
    description: "The name of your application or company",
    category: "app",
    example: "MyAwesome App",
    isRequired: true,
    dataType: "string",
  },
  {
    name: "site_name",
    displayName: "Site Name",
    description: "Alternative name for your site (same as app_name)",
    category: "app",
    example: "MyAwesome App",
    isRequired: true,
    dataType: "string",
  },
  {
    name: "company_name",
    displayName: "Company Name",
    description: "Official company name for legal purposes",
    category: "app",
    example: "MyAwesome App Inc.",
    isRequired: false,
    dataType: "string",
  },
  {
    name: "app_tagline",
    displayName: "App Tagline",
    description: "Your app or company tagline/slogan",
    category: "app",
    example: "Making awesome things happen",
    isRequired: false,
    dataType: "string",
  },

  // User Variables
  {
    name: "user_name",
    displayName: "User Name",
    description: "The recipient's full name",
    category: "user",
    example: "John Doe",
    isRequired: false,
    dataType: "string",
  },
  {
    name: "user_first_name",
    displayName: "User First Name",
    description: "The recipient's first name only",
    category: "user",
    example: "John",
    isRequired: false,
    dataType: "string",
  },
  {
    name: "user_last_name",
    displayName: "User Last Name",
    description: "The recipient's last name only",
    category: "user",
    example: "Doe",
    isRequired: false,
    dataType: "string",
  },
  {
    name: "user_email",
    displayName: "User Email",
    description: "The recipient's email address",
    category: "user",
    example: "john.doe@example.com",
    isRequired: false,
    dataType: "email",
  },

  // Date/Time Variables
  {
    name: "current_year",
    displayName: "Current Year",
    description: "The current year (automatically updated)",
    category: "date",
    example: "2024",
    isRequired: true,
    dataType: "number",
  },
  {
    name: "current_date",
    displayName: "Current Date",
    description: "Today's date in readable format",
    category: "date",
    example: "January 15, 2024",
    isRequired: true,
    dataType: "date",
  },
  {
    name: "current_month",
    displayName: "Current Month",
    description: "Current month name",
    category: "date",
    example: "January",
    isRequired: true,
    dataType: "string",
  },

  // Contact Variables
  {
    name: "support_email",
    displayName: "Support Email",
    description: "Your customer support email address",
    category: "contact",
    example: "support@myapp.com",
    isRequired: true,
    dataType: "email",
  },
  {
    name: "support_phone",
    displayName: "Support Phone",
    description: "Your customer support phone number",
    category: "contact",
    example: "+1 (555) 123-4567",
    isRequired: false,
    dataType: "string",
  },
  {
    name: "company_address",
    displayName: "Company Address",
    description: "Your company's physical address",
    category: "contact",
    example: "123 Main St, City, State 12345",
    isRequired: false,
    dataType: "string",
  },

  // URL Variables
  {
    name: "website_url",
    displayName: "Website URL",
    description: "Your main website URL",
    category: "url",
    example: "https://myapp.com",
    isRequired: true,
    dataType: "url",
  },
  {
    name: "login_url",
    displayName: "Login URL",
    description: "Direct link to your login page",
    category: "url",
    example: "https://myapp.com/login",
    isRequired: false,
    dataType: "url",
  },
  {
    name: "dashboard_url",
    displayName: "Dashboard URL",
    description: "Direct link to user dashboard",
    category: "url",
    example: "https://myapp.com/dashboard",
    isRequired: false,
    dataType: "url",
  },
  {
    name: "unsubscribe_url",
    displayName: "Unsubscribe URL",
    description: "Link for users to unsubscribe from emails",
    category: "url",
    example: "https://myapp.com/unsubscribe?token=abc123",
    isRequired: false,
    dataType: "url",
  },

  // System Variables
  {
    name: "logo_url",
    displayName: "Logo URL",
    description: "URL to your company logo image",
    category: "system",
    example: "https://myapp.com/logo.png",
    isRequired: false,
    dataType: "url",
  },
];

/**
 * Get all system variables grouped by category
 */
export function getSystemVariablesByCategory(): Record<
  string,
  SystemVariable[]
> {
  return SYSTEM_VARIABLES.reduce(
    (acc, variable) => {
      if (!acc[variable.category]) {
        acc[variable.category] = [];
      }
      acc[variable.category].push(variable);
      return acc;
    },
    {} as Record<string, SystemVariable[]>
  );
}

/**
 * Get a system variable by name
 */
export function getSystemVariable(name: string): SystemVariable | undefined {
  return SYSTEM_VARIABLES.find((v) => v.name === name);
}

/**
 * Generate sample data for system variables (for previews)
 */
export function generateSystemVariableSampleData(): Record<string, string> {
  return SYSTEM_VARIABLES.reduce(
    (acc, variable) => {
      acc[`{{${variable.name}}}`] = variable.example;
      return acc;
    },
    {} as Record<string, string>
  );
}

/**
 * Validate if a variable name is a system variable
 */
export function isSystemVariable(name: string): boolean {
  return SYSTEM_VARIABLES.some((v) => v.name === name);
}

/**
 * Populate system variables with actual values from app configuration
 */
export async function populateSystemVariables(
  payload: any,
  additionalData: Record<string, any> = {}
): Promise<Record<string, string>> {
  const variables: Record<string, string> = {};

  try {
    // Get app branding data
    const brandingResult = await payload.find({
      collection: "app-branding",
      where: { isActive: { equals: true } },
      limit: 1,
    });

    const branding = brandingResult.docs[0];

    // Populate system variables
    variables["app_name"] = branding?.appName || "Your App";
    variables["site_name"] = branding?.appName || "Your App";
    variables["company_name"] =
      branding?.companyName || branding?.appName || "Your Company";
    variables["app_tagline"] = branding?.tagline || "Welcome to our platform";

    // Contact information
    variables["support_email"] =
      branding?.contact?.supportEmail || "support@yourapp.com";
    variables["support_phone"] = branding?.contact?.phone || "";
    variables["company_address"] = branding?.contact?.address || "";
    variables["website_url"] =
      branding?.contact?.website || "https://yourapp.com";

    // URLs (these would typically come from environment or config)
    const baseUrl =
      process.env.PAYLOAD_PUBLIC_SERVER_URL || "https://yourapp.com";
    variables["login_url"] = `${baseUrl}/login`;
    variables["dashboard_url"] = `${baseUrl}/dashboard`;
    variables["unsubscribe_url"] = `${baseUrl}/unsubscribe`;
    variables["logo_url"] = branding?.logo?.url || `${baseUrl}/logo.png`;

    // Date variables
    const now = new Date();
    variables["current_year"] = now.getFullYear().toString();
    variables["current_date"] = now.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
    variables["current_month"] = now.toLocaleDateString("en-US", {
      month: "long",
    });

    // User-specific variables (from additionalData)
    variables["user_name"] =
      additionalData.user_name || additionalData.userName || "";
    variables["user_first_name"] =
      additionalData.user_first_name || additionalData.firstName || "";
    variables["user_last_name"] =
      additionalData.user_last_name || additionalData.lastName || "";
    variables["user_email"] =
      additionalData.user_email || additionalData.email || "";

    // Add any additional variables passed in
    Object.keys(additionalData).forEach((key) => {
      if (!variables[key]) {
        variables[key] = String(additionalData[key]);
      }
    });
  } catch (error) {
    console.error("Error populating system variables:", error);
    // Return default values if there's an error
    return generateSystemVariableSampleData();
  }

  return variables;
}
