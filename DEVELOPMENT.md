# Development Guidelines

## Package Manager

**IMPORTANT: This project uses pnpm as the package manager.**

Always use `pnpm` instead of `npm` or `yarn` for:
- Installing dependencies: `pnpm install`
- Adding packages: `pnpm add <package-name>`
- Running scripts: `pnpm run <script-name>`

## Email Configuration

This project uses a database-driven email configuration system instead of environment variables.

### Setting up Email

1. Start the development server: `pnpm run dev`
2. Navigate to the admin panel: `http://localhost:3200/admin`
3. Go to **Settings > Email Settings**
4. Create a new email configuration with your preferred provider:
   - Give it a **name** (e.g., "Production SMTP", "Gmail Backup")
   - Choose your **provider** (SMTP recommended)
   - Mark it as **Active** to enable it
   - Mark it as **Default** to use it as the primary email service
   - Configure the provider-specific settings

**Note**: Only one configuration can be active and default at a time.

### Testing Email Configuration

Once you've created an email configuration, you can test it using the API endpoint:

1. **Via Admin Panel**: Open the email configuration and see the test instructions at the bottom
2. **Via API**: Send a POST request to `/api/email-settings/test-email/[CONFIG_ID]`
   ```json
   {
     "testEmail": "your-email@example.com"
   }
   ```
3. **Via cURL**:
   ```bash
   curl -X POST http://localhost:3200/api/email-settings/test-email/[CONFIG_ID] \
     -H "Content-Type: application/json" \
     -d '{"testEmail": "your-email@example.com"}'
   ```

The test email will be sent using the specific configuration (regardless of active/default status).

### Supported Email Providers

- **SMTP**: Any SMTP server (Gmail, Yahoo, custom servers) - **Primary recommended option**
- **Gmail**: Direct Gmail integration with app passwords
- **Microsoft Outlook**: Outlook/Hotmail integration
- **Amazon SES**: AWS email service

### Email Features

- **Database-driven configuration**: Email settings are stored in the database, not environment variables
- **Named configurations**: Each email configuration has a friendly name for easy identification
- **Active/Default status**: Mark configurations as active and set one as default
- **Dynamic switching**: Change email providers without restarting the application
- **Single active configuration**: Only one email configuration can be active and default at a time
- **Automatic refresh**: Email adapter refreshes automatically when settings change
- **Development fallback**: Uses nodemailer with console transport in development
- **Test email functionality**: Send test emails directly from the admin panel
- User signup verification emails
- Password reset emails
- Custom email sending through the email service

### Development

During development, if no email configuration is active, the system will use Ethereal Email (fake SMTP service) for testing.