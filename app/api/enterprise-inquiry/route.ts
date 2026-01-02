import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const blockedDomains = [
  "yopmail.com",
  "mailinator.com",
  "tempmail.com",
  "10minutemail.com",
  "guerrillamail.com",
  "getnada.com",
  "trashmail.com",
  "dispostable.com",
  "maildrop.cc",
  "fakeinbox.com",
  "mytemp.email",
  "sharklasers.com",
  "throwawaymail.com",
  "mailnesia.com",
  "temporary-mail.net",
  "moakt.com",
];

function isValidEmail(email: string) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function isBlockedDomain(email: string) {
  const domain = email.split("@")[1]?.toLowerCase() || "";
  return blockedDomains.some((d) => domain === d || domain.endsWith(`.${d}`));
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

type InquiryPayload = {
  name: string;
  email: string;
  company?: string;
  role?: string;
  inquiryType: string;
  message: string;
};

const allowedInquiryTypes = [
  "Flexible SLA",
  "Managed Services",
  "Custom Integrations",
  "Enterprise Pricing",
  "Other",
] as const;

export async function POST(request: Request) {
  try {
    let body: InquiryPayload;
    try {
      body = (await request.json()) as InquiryPayload;
    } catch {
      return NextResponse.json(
        { message: "Invalid JSON body." },
        { status: 400 }
      );
    }

    const name = (body.name || "").trim();
    const email = (body.email || "").trim();
    const company = (body.company || "").trim();
    const role = (body.role || "").trim();
    const inquiryType = (body.inquiryType || "").trim();
    const message = (body.message || "").trim();

    if (!name || !email || !inquiryType || !message) {
      return NextResponse.json(
        { message: "Missing required fields." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { message: "Invalid email address." },
        { status: 400 }
      );
    }

    if (isBlockedDomain(email)) {
      return NextResponse.json(
        { message: "Temporary email addresses are not allowed." },
        { status: 400 }
      );
    }

    if (!allowedInquiryTypes.includes(inquiryType as any)) {
      return NextResponse.json(
        { message: "Invalid inquiry type." },
        { status: 400 }
      );
    }

    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpPort = parseInt(process.env.SMTP_PORT || "465", 10);

    const inquiryTo =
      process.env.ENTERPRISE_INQUIRY_TO ||
      process.env.CONTACT_SALES_TO ||
      process.env.SUPPORT_EMAIL ||
      smtpUser;

    if (!smtpHost || !smtpUser || !smtpPass) {
      const missing = [
        !smtpHost ? "SMTP_HOST" : null,
        !smtpUser ? "SMTP_USER" : null,
        !smtpPass ? "SMTP_PASS" : null,
      ].filter(Boolean);

      return NextResponse.json(
        {
          message: "Email service is not configured.",
          missing,
        },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeCompany = escapeHtml(company);
    const safeRole = escapeHtml(role);
    const safeInquiryType = escapeHtml(inquiryType);
    const safeMessage = escapeHtml(message).replace(/\n/g, "<br/>");

    const subject = `Enterprise Inquiry: ${inquiryType}`;

    const adminMail = {
      from: `"KaeroPrescribe" <${smtpUser}>`,
      to: inquiryTo,
      replyTo: email,
      subject,
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <style>
            body { font-family: Segoe UI, Roboto, Helvetica, Arial, sans-serif; background: #f7f9fc; color: #111827; margin: 0; padding: 0; }
            .card { max-width: 680px; margin: 32px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 24px rgba(0,0,0,.08); }
            .head { background: linear-gradient(135deg, #0a3fa3, #2b63d9); color: #fff; padding: 22px 24px; }
            .head h1 { margin: 0; font-size: 18px; }
            .content { padding: 22px 24px; line-height: 1.6; }
            .meta { width: 100%; border-collapse: collapse; margin: 0 0 16px; }
            .meta td { padding: 6px 0; vertical-align: top; }
            .label { width: 160px; color: #6b7280; font-weight: 600; }
            .value { color: #111827; }
            .box { background: #f3f4f6; border-left: 4px solid #0a3fa3; padding: 14px 16px; border-radius: 8px; }
            .foot { background: #f3f4f6; padding: 14px 16px; text-align: center; color: #6b7280; font-size: 12px; }
            a { color: #0a3fa3; text-decoration: none; }
          </style>
        </head>
        <body>
          <div class="card">
            <div class="head"><h1>New Enterprise Inquiry</h1></div>
            <div class="content">
              <table class="meta">
                <tr><td class="label">Name</td><td class="value">${safeName}</td></tr>
                <tr><td class="label">Email</td><td class="value"><a href="mailto:${safeEmail}">${safeEmail}</a></td></tr>
                ${company ? `<tr><td class="label">Company</td><td class="value">${safeCompany}</td></tr>` : ""}
                ${role ? `<tr><td class="label">Role</td><td class="value">${safeRole}</td></tr>` : ""}
                <tr><td class="label">Inquiry Type</td><td class="value">${safeInquiryType}</td></tr>
              </table>
              <div class="box">
                ${safeMessage}
              </div>
            </div>
            <div class="foot">
              Sent via KaeroPrescribe “Contact Sales” form.
            </div>
          </div>
        </body>
        </html>
      `.trim(),
    };

    const confirmationMail = {
      from: `"KaeroPrescribe" <${smtpUser}>`,
      to: email,
      subject: "We’ve received your enterprise inquiry — KaeroPrescribe",
      html: `
        <!DOCTYPE html>
        <html lang="en">
        <head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
        <body style="background:#f7f9fc;font-family:Segoe UI,Roboto,Arial,sans-serif;margin:0;padding:0;color:#111827;">
          <div style="max-width:680px;margin:32px auto;background:#fff;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.08);overflow:hidden;">
            <div style="background:linear-gradient(135deg,#0a3fa3,#2b63d9);color:#fff;padding:22px 24px;">
              <h1 style="font-size:18px;margin:0;">Thanks — we’ve received your inquiry</h1>
            </div>
            <div style="padding:22px 24px;line-height:1.6;">
              <p style="margin-top:0;">Hi ${safeName || "there"},</p>
              <p>We’ve received your request regarding <strong>${safeInquiryType}</strong>. Our team will get back to you within the next <strong>24 hours</strong>.</p>
              <div style="background:#f3f4f6;border-left:4px solid #0a3fa3;padding:14px 16px;border-radius:8px;">
                <p style="margin:0 0 8px;"><em>Your message:</em></p>
                <p style="margin:0;">${safeMessage || "(no message)"}</p>
              </div>
              <p style="margin:18px 0 0;">Warm regards,<br/><strong>KaeroPrescribe Team</strong></p>
            </div>
            <div style="background:#f3f4f6;text-align:center;padding:14px 16px;font-size:12px;color:#6b7280;">
              <p style="margin:0;">This is an automated message — please don’t reply directly.</p>
              <p style="margin:6px 0 0;">© ${new Date().getFullYear()} Kaero Group. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `.trim(),
    };

    await transporter.sendMail(adminMail);
    transporter.sendMail(confirmationMail).catch(() => null);

    return NextResponse.json(
      { message: "Inquiry sent successfully!" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: "Error sending inquiry.",
        error: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
