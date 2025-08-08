# Email System Architecture

## Project Size Analysis

**Current Project Size: ~1.5GB**
- `node_modules`: 1.3GB (normal for modern JS projects with dependencies)
- `src`: 212KB (actual code)
- `pnpm-lock.yaml`: 220KB (dependency lock file)

This is typical for a Payload CMS project with multiple plugins. The size comes from:
- Next.js dependencies
- Payload CMS core and plugins
- Database drivers (PostgreSQL)
- Rich text editor dependencies
- TypeScript compilation tools

## Email Templates Structure

### Folder Organization
```
src/emails/
├── templates/
│   ├── auth/
│   │   ├── welcome.tsx
│   │   ├── password-reset.tsx
│   │   ├── email-verification.tsx
│   │   └── login-notification.tsx
│   ├── transactional/
│   │   ├── order-confirmation.tsx
│   │   ├── shipping-notification.tsx
│   │   ├── invoice.tsx
│   │   └── receipt.tsx
│   ├── marketing/
│   │   ├── newsletter.tsx
│   │   ├── product-announcement.tsx
│   │   ├── promotional.tsx
│   │   └── abandoned-cart.tsx
│   ├── system/
│   │   ├── error-notification.tsx
│   │   ├── maintenance.tsx
│   │   ├── backup-complete.tsx
│   │   └── security-alert.tsx
│   └── forms/
│       ├── contact-form-submission.tsx
│       ├── support-ticket.tsx
│       └── feedback-received.tsx
├── components/
│   ├── layout/
│   │   ├── EmailLayout.tsx
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Divider.tsx
│   │   └── Logo.tsx
│   └── blocks/
│       ├── HeroSection.tsx
│       ├── ContentBlock.tsx
│       ├── ProductGrid.tsx
│       └── SocialLinks.tsx
├── styles/
│   ├── base.css
│   ├── components.css
│   └── themes/
│       ├── default.css
│       ├── dark.css
│       └── custom.css
├── utils/
│   ├── emailHelpers.ts
│   ├── templateRenderer.ts
│   └── variableInjector.ts
└── config/
    ├── emailConfig.ts
    └── templateConfig.ts
```

## Essential Email Templates List

### 1. Authentication & User Management
- **Welcome Email**: New user registration
- **Email Verification**: Confirm email address
- **Password Reset**: Reset password link
- **Password Changed**: Confirmation of password change
- **Login Notification**: Security notification for new login
- **Account Deactivation**: Account suspension notice

### 2. Transactional Emails
- **Order Confirmation**: Purchase confirmation
- **Payment Receipt**: Payment successful
- **Shipping Notification**: Order shipped
- **Delivery Confirmation**: Order delivered
- **Refund Processed**: Refund confirmation
- **Invoice**: Billing invoice



### 3. System & Administrative
- **Error Notification**: System error alerts
- **Maintenance Notice**: Scheduled maintenance
- **Security Alert**: Security-related notifications
- **Backup Complete**: System backup confirmation

## Backend Configuration System

### Email Branding Collection

Create a new collection `EmailBranding.ts`:

```typescript
import type { CollectionConfig } from 'payload'

export const EmailBranding: CollectionConfig = {
  slug: 'email-branding',
  admin: {
    useAsTitle: 'name',
    group: 'Email System',
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
      defaultValue: 'Default Brand',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    {
      name: 'appName',
      type: 'text',
      required: true,
      defaultValue: 'Your App Name',
    },
    {
      name: 'tagline',
      type: 'text',
      defaultValue: 'Your app tagline',
    },
    {
      name: 'colors',
      type: 'group',
      fields: [
        {
          name: 'primary',
          type: 'text',
          admin: {
            components: {
              Field: 'ColorPickerField', // Custom color picker component
            },
          },
          defaultValue: '#007bff',
        },
        {
          name: 'secondary',
          type: 'text',
          admin: {
            components: {
              Field: 'ColorPickerField',
            },
          },
          defaultValue: '#6c757d',
        },
        {
          name: 'accent',
          type: 'text',
          admin: {
            components: {
              Field: 'ColorPickerField',
            },
          },
          defaultValue: '#28a745',
        },
        {
          name: 'background',
          type: 'text',
          admin: {
            components: {
              Field: 'ColorPickerField',
            },
          },
          defaultValue: '#ffffff',
        },
        {
          name: 'text',
          type: 'text',
          admin: {
            components: {
              Field: 'ColorPickerField',
            },
          },
          defaultValue: '#333333',
        },
      ],
    },
    {
      name: 'typography',
      type: 'group',
      fields: [
        {
          name: 'fontFamily',
          type: 'select',
          options: [
            { label: 'Arial', value: 'Arial, sans-serif' },
            { label: 'Helvetica', value: 'Helvetica, sans-serif' },
            { label: 'Georgia', value: 'Georgia, serif' },
            { label: 'Times New Roman', value: 'Times New Roman, serif' },
          ],
          defaultValue: 'Arial, sans-serif',
        },
        {
          name: 'fontSize',
          type: 'number',
          defaultValue: 16,
        },
        {
          name: 'lineHeight',
          type: 'number',
          defaultValue: 1.5,
        },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      fields: [
        {
          name: 'supportEmail',
          type: 'email',
          required: true,
        },
        {
          name: 'phone',
          type: 'text',
        },
        {
          name: 'address',
          type: 'textarea',
        },
        {
          name: 'website',
          type: 'text',
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      fields: [
        {
          name: 'platform',
          type: 'select',
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'Twitter', value: 'twitter' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'YouTube', value: 'youtube' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
    },
  ],
}
```

## Visual Email Design Options

### Option 1: React Email + Custom Builder
**Recommended Approach**

**Pros:**
- Type-safe email templates
- Component-based architecture
- Great developer experience
- Excellent email client compatibility
- Can build custom visual editor on top

**Implementation:**
```bash
pnpm add react-email @react-email/components
```

### Option 2: MJML Integration
**Alternative Approach**

**Pros:**
- Industry standard for email templates
- Excellent cross-client compatibility
- Visual editor available
- Responsive by default

**Implementation:**
```bash
pnpm add mjml mjml-react
```

### Option 3: Custom Visual Builder
**Advanced Approach**

**Features:**
- Drag-and-drop interface
- Real-time preview
- Template library
- Custom component blocks

**Technologies:**
- React DnD or @dnd-kit
- Monaco Editor for code editing
- iframe for email preview
- Custom Payload admin components

### Option 4: Third-party Integration
**External Services**

- **Unlayer**: Email editor SDK
- **GrapesJS**: Open-source web builder
- **Stripo**: Email template editor
- **Mailchimp**: Template editor API

## Email Variables System

### Global Variables
```typescript
interface EmailVariables {
  // Branding
  appName: string
  logo: string
  primaryColor: string
  secondaryColor: string
  
  // Contact
  supportEmail: string
  phone: string
  address: string
  website: string
  
  // User-specific
  userName: string
  userEmail: string
  userId: string
  
  // Dynamic content
  currentDate: string
  currentYear: string
  unsubscribeUrl: string
  preferencesUrl: string
}
```

### Template-specific Variables
```typescript
// Welcome email
interface WelcomeEmailVariables extends EmailVariables {
  verificationUrl: string
  loginUrl: string
}

// Order confirmation
interface OrderEmailVariables extends EmailVariables {
  orderNumber: string
  orderTotal: string
  orderItems: OrderItem[]
  shippingAddress: Address
  trackingUrl?: string
}
```

## Implementation Roadmap

### Phase 1: Foundation (Week 1)
1. Create EmailBranding collection
2. Set up email templates folder structure
3. Install React Email
4. Create base email layout component
5. Implement variable injection system

### Phase 2: Core Templates (Week 2)
1. Build authentication email templates
2. Create transactional email templates
3. Implement form submission templates
4. Add email preview functionality

### Phase 3: Visual Editor (Week 3-4)
1. Research and choose visual editor approach
2. Build custom admin components
3. Integrate color picker fields
4. Create template preview system
5. Add template versioning

### Phase 4: Advanced Features (Week 5-6)
1. A/B testing for email templates
2. Email analytics integration
3. Template performance monitoring
4. Advanced personalization
5. Multi-language support

## Technical Considerations

### Email Client Compatibility
- Use table-based layouts for maximum compatibility
- Inline CSS for styling
- Fallback fonts and colors
- Test across major email clients

### Performance
- Optimize images for email
- Minimize template size
- Use CDN for assets
- Implement template caching

### Security
- Sanitize user input in templates
- Validate email addresses
- Implement rate limiting
- Use secure image hosting

### Accessibility
- Alt text for images
- Proper heading structure
- High contrast colors
- Screen reader friendly markup

This architecture provides a comprehensive foundation for a professional email system with visual design capabilities, brand customization, and scalable template management.