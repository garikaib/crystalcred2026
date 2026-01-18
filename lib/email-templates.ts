export const emailStyles = {
  colors: {
    primary: "#0d9488",
    background: "#f8fafc",
    container: "#ffffff",
    text: "#1a1a2e",
    muted: "#64748b",
    border: "#e2e8f0",
  },
  fonts: {
    body: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
  },
}

function baseLayout(title: string, content: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; background-color: ${emailStyles.colors.background}; font-family: ${emailStyles.fonts.body}; color: ${emailStyles.colors.text};">
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" width="600" border="0" cellspacing="0" cellpadding="0" style="background-color: ${emailStyles.colors.container}; border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
          <!-- Header -->
          <tr>
            <td style="background-color: ${emailStyles.colors.primary}; padding: 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: bold;">CrystalCred</h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px 30px;">
              ${content}
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: ${emailStyles.colors.background}; padding: 20px; text-align: center; border-top: 1px solid ${emailStyles.colors.border};">
              <p style="margin: 0; font-size: 12px; color: ${emailStyles.colors.muted};">
                &copy; ${new Date().getFullYear()} CrystalCred. All rights reserved.
              </p>
              <p style="margin: 10px 0 0; font-size: 12px; color: ${emailStyles.colors.muted};">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://crystalcred.co.zw'}" style="color: ${emailStyles.colors.primary}; text-decoration: none;">Visit Website</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `
}

export function contactAdminEmail(data: { name: string; email: string; phone: string; message: string }): string {
  const content = `
    <h2 style="margin-top: 0; color: ${emailStyles.colors.primary};">New Contact Form Submission</h2>
    <div style="background-color: ${emailStyles.colors.background}; padding: 20px; border-radius: 6px; margin: 20px 0;">
      <p style="margin: 0 0 10px;"><strong>Name:</strong> ${data.name}</p>
      <p style="margin: 0 0 10px;"><strong>Email:</strong> <a href="mailto:${data.email}" style="color: ${emailStyles.colors.primary};">${data.email}</a></p>
      <p style="margin: 0 0 10px;"><strong>Phone:</strong> ${data.phone}</p>
    </div>
    <h3 style="color: ${emailStyles.colors.text}; margin-bottom: 15px;">Message:</h3>
    <div style="padding: 15px; border-left: 4px solid ${emailStyles.colors.primary}; background-color: ${emailStyles.colors.background};">
      ${data.message.replace(/\n/g, "<br>")}
    </div>
  `
  return baseLayout(`New Contact from ${data.name}`, content)
}

export function userConfirmationEmail(name: string): string {
  const content = `
    <h2 style="margin-top: 0; color: ${emailStyles.colors.primary};">We Received Your Message</h2>
    <p>Hi ${name},</p>
    <p>Thank you for reaching out to <strong>CrystalCred</strong>. We have received your message and our team will review it shortly.</p>
    <p>We typically respond within 24 hours.</p>
    <br>
    <p>Best regards,</p>
    <p><strong>The CrystalCred Team</strong></p>
  `
  return baseLayout("Message Received - CrystalCred", content)
}

export function resetPasswordEmail(resetUrl: string): string {
  const content = `
    <h2 style="margin-top: 0; color: ${emailStyles.colors.primary};">Reset Your Password</h2>
    <p>You requested to reset your password for your CrystalCred admin account.</p>
    <p>Click the button below to proceed. This link is valid for 1 hour.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${resetUrl}" style="display: inline-block; background-color: ${emailStyles.colors.primary}; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">Reset Password</a>
    </div>
    <p style="font-size: 14px; color: ${emailStyles.colors.muted};">If the button doesn't work, copy and paste this link into your browser:</p>
    <p style="font-size: 12px; color: ${emailStyles.colors.muted}; word-break: break-all;">${resetUrl}</p>
    <br>
    <p style="font-size: 14px; color: ${emailStyles.colors.muted};">If you didn't request a password reset, simple ignore this email.</p>
  `
  return baseLayout("Reset Your Password - CrystalCred", content)
}

export function magicLinkEmail(url: string, host: string): string {
  const content = `
    <h2 style="margin-top: 0; color: ${emailStyles.colors.primary};">Sign in to CrystalCred</h2>
    <p>Click the button below to sign in to the admin portal.</p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="${url}" style="display: inline-block; background-color: ${emailStyles.colors.primary}; color: #ffffff; padding: 12px 24px; border-radius: 6px; text-decoration: none; font-weight: bold;">Sign In</a>
    </div>
     <p style="font-size: 14px; color: ${emailStyles.colors.muted};">If the button doesn't work, copy and paste this link into your browser:</p>
    <p style="font-size: 12px; color: ${emailStyles.colors.muted}; word-break: break-all;">${url}</p>
    <br>
    <p style="font-size: 14px; color: ${emailStyles.colors.muted};">If you didn't request this email, you can safely ignore it.</p>
  `
  return baseLayout(`Sign in to ${host}`, content)
}
