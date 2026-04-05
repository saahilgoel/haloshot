import { Resend } from "resend";
import { APP_NAME, APP_URL } from "../utils/constants";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.FROM_EMAIL || `${APP_NAME} <noreply@haloshot.ai>`;

/**
 * Send a welcome email after signup.
 */
export async function sendWelcomeEmail(email: string, name: string) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Welcome to ${APP_NAME}!`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Welcome to ${APP_NAME}, ${name}!</h1>
        <p>You're all set to create stunning AI-generated professional headshots.</p>
        <p>Here's what you can do:</p>
        <ul>
          <li>Upload a few selfies to get started</li>
          <li>Choose from 8 professional styles</li>
          <li>Get studio-quality headshots in under 90 seconds</li>
        </ul>
        <a href="${APP_URL}/generate" style="display: inline-block; padding: 12px 24px; background: #6C3CE1; color: white; text-decoration: none; border-radius: 8px; margin-top: 16px;">
          Generate Your First Headshot
        </a>
        <p style="margin-top: 24px; color: #666; font-size: 14px;">
          You have 3 free generations to try it out. Upgrade to Pro for unlimited headshots.
        </p>
      </div>
    `,
  });
}

/**
 * Send a notification when a generation job has completed.
 */
export async function sendGenerationCompleteEmail(
  email: string,
  name: string,
  jobId: string
) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `Your ${APP_NAME} headshots are ready!`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Your headshots are ready, ${name}!</h1>
        <p>We've generated your professional headshots. Click below to view and download them.</p>
        <a href="${APP_URL}/generate/${jobId}" style="display: inline-block; padding: 12px 24px; background: #6C3CE1; color: white; text-decoration: none; border-radius: 8px; margin-top: 16px;">
          View Your Headshots
        </a>
        <p style="margin-top: 24px; color: #666; font-size: 14px;">
          Not happy with the results? Try a different style or upload new reference photos.
        </p>
      </div>
    `,
  });
}

/**
 * Send a referral reward notification email.
 */
export async function sendReferralRewardEmail(
  email: string,
  name: string,
  credits: number
) {
  return resend.emails.send({
    from: FROM_EMAIL,
    to: email,
    subject: `You earned ${credits} referral credits on ${APP_NAME}!`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Great news, ${name}!</h1>
        <p>Someone you referred just signed up for ${APP_NAME}. You've earned <strong>${credits} referral credits</strong>!</p>
        <p>Your credits have been automatically added to your account and can be used toward Pro features.</p>
        <a href="${APP_URL}/refer" style="display: inline-block; padding: 12px 24px; background: #6C3CE1; color: white; text-decoration: none; border-radius: 8px; margin-top: 16px;">
          View Your Referral Dashboard
        </a>
        <p style="margin-top: 24px; color: #666; font-size: 14px;">
          Keep sharing to earn more credits!
        </p>
      </div>
    `,
  });
}
