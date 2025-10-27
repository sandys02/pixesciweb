import { Resend } from 'resend';

let connectionSettings: any;

async function getCredentials() {
  const hostname = process.env.REPLIT_CONNECTORS_HOSTNAME;
  const xReplitToken = process.env.REPL_IDENTITY 
    ? 'repl ' + process.env.REPL_IDENTITY 
    : process.env.WEB_REPL_RENEWAL 
    ? 'depl ' + process.env.WEB_REPL_RENEWAL 
    : null;

  if (!xReplitToken) {
    throw new Error('X_REPLIT_TOKEN not found for repl/depl');
  }

  connectionSettings = await fetch(
    'https://' + hostname + '/api/v2/connection?include_secrets=true&connector_names=resend',
    {
      headers: {
        'Accept': 'application/json',
        'X_REPLIT_TOKEN': xReplitToken
      }
    }
  ).then(res => res.json()).then(data => data.items?.[0]);

  if (!connectionSettings || (!connectionSettings.settings.api_key)) {
    throw new Error('Resend not connected');
  }
  return {apiKey: connectionSettings.settings.api_key, fromEmail: connectionSettings.settings.from_email};
}

async function getUncachableResendClient() {
  const credentials = await getCredentials();
  return {
    client: new Resend(credentials.apiKey),
    fromEmail: credentials.fromEmail
  };
}

export async function sendWaitlistConfirmation(email: string, name: string): Promise<void> {
  try {
    const { client, fromEmail } = await getUncachableResendClient();
    
    await client.emails.send({
      from: fromEmail,
      to: email,
      subject: "Welcome to the PixeSci Waitlist!",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to PixeSci</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 40px 20px;">
              <tr>
                <td align="center">
                  <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
                    <!-- Header -->
                    <tr>
                      <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); border-radius: 8px 8px 0 0;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                          🔬 PixeSci
                        </h1>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px;">
                        <h2 style="margin: 0 0 20px; color: #1e293b; font-size: 24px; font-weight: 600;">
                          Welcome to the Future of Science Software!
                        </h2>
                        
                        <p style="margin: 0 0 16px; color: #475569; font-size: 16px; line-height: 1.6;">
                          Hi ${name},
                        </p>
                        
                        <p style="margin: 0 0 16px; color: #475569; font-size: 16px; line-height: 1.6;">
                          Thank you for joining the PixeSci waitlist! You're now part of an exclusive group of researchers who will get first access to our AI-powered platform that makes scientific software simple.
                        </p>
                        
                        <div style="background-color: #f1f5f9; border-left: 4px solid #3b82f6; padding: 20px; margin: 24px 0; border-radius: 4px;">
                          <p style="margin: 0; color: #1e293b; font-size: 15px; line-height: 1.6;">
                            <strong>What's Next?</strong><br>
                            We're working hard to bring PixeSci to life. Beta launches in Q1 2026, and as a waitlist member, you'll be among the first to try it out. We'll keep you updated on our progress!
                          </p>
                        </div>
                        
                        <p style="margin: 24px 0 16px; color: #475569; font-size: 16px; line-height: 1.6;">
                          In the meantime, feel free to reply to this email if you have any questions or feedback.
                        </p>
                        
                        <p style="margin: 0; color: #475569; font-size: 16px; line-height: 1.6;">
                          Best regards,<br>
                          <strong>The PixeSci Team</strong>
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="padding: 30px 40px; background-color: #f8fafc; border-radius: 0 0 8px 8px; text-align: center;">
                        <p style="margin: 0 0 8px; color: #64748b; font-size: 14px;">
                          Making science software simple
                        </p>
                        <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                          © 2025 PixeSci. All rights reserved.
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    throw error;
  }
}
