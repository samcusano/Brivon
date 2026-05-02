/**
 * Transactional email via Resend.
 * Set RESEND_API_KEY in .env to enable. If not set, emails are logged to console only.
 * Set APP_URL in .env (e.g. https://yourapp.com) to build case links correctly.
 */

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const APP_URL = process.env.APP_URL ?? "http://localhost:3001";
const FROM = process.env.EMAIL_FROM ?? "Appeal AI <noreply@appeal.ai>";
const ADVOCATE_EMAIL = process.env.ADVOCATE_EMAIL ?? "advocate@appeal.ai";

interface EmailPayload {
  to: string;
  subject: string;
  html: string;
}

async function send(payload: EmailPayload): Promise<void> {
  if (!RESEND_API_KEY) {
    console.log("[email] RESEND_API_KEY not set — would have sent:", payload.subject, "→", payload.to);
    return;
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM,
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
    }),
  });

  if (!res.ok) {
    const body = await res.text();
    console.error("[email] Resend error:", res.status, body);
  }
}

function caseUrl(caseId: string) {
  return `${APP_URL}/case/${caseId}`;
}

function baseHtml(body: string) {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8" /><style>
  body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1a1a1a; background: #fafaf8; margin: 0; padding: 0; }
  .wrap { max-width: 560px; margin: 40px auto; background: #fff; border-radius: 12px; border: 1px solid #e8e0d8; overflow: hidden; }
  .header { background: #8b3a2a; padding: 24px 32px; }
  .header h1 { color: #fff; font-size: 20px; margin: 0; font-weight: 600; }
  .body { padding: 32px; }
  .body p { font-size: 15px; line-height: 1.6; color: #444; margin: 0 0 16px; }
  .btn { display: inline-block; background: #8b3a2a; color: #fff !important; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 15px; margin: 8px 0 16px; }
  .footer { padding: 16px 32px 24px; font-size: 12px; color: #999; border-top: 1px solid #f0ebe3; }
</style></head>
<body>
  <div class="wrap">
    <div class="header"><h1>Appeal AI</h1></div>
    <div class="body">${body}</div>
    <div class="footer">Appeal AI · HIPAA-compliant · Questions? Reply to this email.</div>
  </div>
</body>
</html>`;
}

/**
 * Sent to patient immediately after they submit the intake form.
 */
export async function sendCaseReceived(params: {
  patientEmail: string;
  patientName: string;
  caseId: string;
  deniedItem: string;
  insurerName: string;
}): Promise<void> {
  await send({
    to: params.patientEmail,
    subject: "Your appeal has been submitted — Appeal AI",
    html: baseHtml(`
      <p>Hi ${params.patientName},</p>
      <p>We've received your appeal for <strong>${params.deniedItem}</strong> denied by ${params.insurerName}.</p>
      <p>Our AI is drafting your personalized appeal letter right now. A nurse advocate will review and finalize it within 24 hours.</p>
      <a class="btn" href="${caseUrl(params.caseId)}">Track your case</a>
      <p>Bookmark that link — it's your permanent case page. We'll also email you when your letter is ready.</p>
    `),
  });
}

/**
 * Sent to patient when the advocate approves the letter.
 */
export async function sendLetterReady(params: {
  patientEmail: string;
  patientName: string;
  caseId: string;
  deniedItem: string;
}): Promise<void> {
  await send({
    to: params.patientEmail,
    subject: "Your appeal letter is ready to submit — Appeal AI",
    html: baseHtml(`
      <p>Hi ${params.patientName},</p>
      <p>Great news — a nurse advocate has reviewed and finalized your appeal letter for <strong>${params.deniedItem}</strong>.</p>
      <p>Your letter is ready to download and submit to your insurer.</p>
      <a class="btn" href="${caseUrl(params.caseId)}">View & download your letter</a>
      <p>Remember to fill in the bracketed placeholders (physician name, contact info, and today's date) before submitting. Having your physician sign the letter significantly increases your chances of success.</p>
      <p>Insurers must respond to appeals within 30–60 days of receipt.</p>
    `),
  });
}

/**
 * Sent to the advocate when a new case is ready for review.
 */
export async function sendAdvocateNewCase(params: {
  caseId: string;
  patientName: string;
  deniedItem: string;
  insurerName: string;
  denialReason: string;
}): Promise<void> {
  await send({
    to: ADVOCATE_EMAIL,
    subject: `New case ready for review: ${params.patientName} — ${params.deniedItem}`,
    html: baseHtml(`
      <p>A new appeal letter is ready for your review.</p>
      <table style="width:100%;border-collapse:collapse;font-size:14px;margin:0 0 20px">
        <tr><td style="padding:6px 0;color:#666;width:120px">Patient</td><td style="padding:6px 0;font-weight:600">${params.patientName}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Denied item</td><td style="padding:6px 0">${params.deniedItem}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Insurer</td><td style="padding:6px 0">${params.insurerName}</td></tr>
        <tr><td style="padding:6px 0;color:#666">Denial reason</td><td style="padding:6px 0;font-style:italic">"${params.denialReason}"</td></tr>
      </table>
      <a class="btn" href="${APP_URL}/advocate">Open advocate portal</a>
    `),
  });
}
