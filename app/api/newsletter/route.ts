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
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

type NewsletterPayload = {
  email: string;
};

export async function POST(request: Request) {
  const debug = process.env.DEBUG_EMAIL === "true";
  const requestId =
    (globalThis.crypto as any)?.randomUUID?.() ||
    `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const receivedAt = new Date();
  const userAgent = request.headers.get("user-agent") || "";
  const referer = request.headers.get("referer") || "";
  const origin = request.headers.get("origin") || "";
  const forwardedFor = request.headers.get("x-forwarded-for") || "";
  const realIp = request.headers.get("x-real-ip") || "";

  try {
    if (debug) {
      console.log("[newsletter] start", {
        requestId,
        runtime: process.env.NEXT_RUNTIME,
        nodeEnv: process.env.NODE_ENV,
      });
    }

    let body: NewsletterPayload;
    try {
      body = (await request.json()) as NewsletterPayload;
    } catch {
      return NextResponse.json(
        { message: "Invalid JSON body." },
        { status: 400 }
      );
    }

    const email = (body.email || "").trim();

    if (debug) {
      console.log("[newsletter] payload", {
        requestId,
        hasEmail: Boolean(email),
      });
    }

    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
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

    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpPort = parseInt(process.env.SMTP_PORT || "465", 10);

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

    const to =
      process.env.NEWSLETTER_TO ||
      process.env.SUPPORT_EMAIL ||
      process.env.CONTACT_SALES_TO ||
      process.env.ENTERPRISE_INQUIRY_TO ||
      smtpUser;

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    if (debug) {
      console.log("[newsletter] smtp", {
        requestId,
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        to,
        user: smtpUser,
      });

      try {
        await transporter.verify();
        console.log("[newsletter] smtp verify ok", { requestId });
      } catch (verifyError: any) {
        console.log("[newsletter] smtp verify failed", {
          requestId,
          code: verifyError?.code,
          message: verifyError?.message,
        });
      }
    }

    const safeEmail = escapeHtml(email);

    const safeOrigin = escapeHtml(origin);
    const safeReferer = escapeHtml(referer);
    const safeUserAgent = escapeHtml(userAgent);
    const safeForwardedFor = escapeHtml(forwardedFor);
    const safeRealIp = escapeHtml(realIp);

    const timestampIso = receivedAt.toISOString();
    const timestampReadable = receivedAt.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });

    const sourceLabel = "Footer newsletter form";

    const info = await transporter.sendMail({
      from: `"KaeroPrescribe" <${smtpUser}>`,
      to,
      replyTo: email,
      subject: `New newsletter signup — ${email}`,
      text: [
        "New newsletter signup (KaeroPrescribe)",
        "",
        `Subscriber: ${email}`,
        `Source: ${sourceLabel}`,
        `Received: ${timestampReadable} (${timestampIso})`,
        `Request ID: ${requestId}`,
        origin ? `Origin: ${origin}` : null,
        referer ? `Referer: ${referer}` : null,
        realIp ? `IP: ${realIp}` : null,
        forwardedFor ? `X-Forwarded-For: ${forwardedFor}` : null,
        userAgent ? `User-Agent: ${userAgent}` : null,
        "",
        "Next steps:",
        "- Add this email to your newsletter list in your email tool.",
        "- If you don't recognize this signup, you can ignore it.",
      ]
        .filter(Boolean)
        .join("\n"),
      html: `
        <!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          </head>
          <body style="font-family:Segoe UI,Roboto,Arial,sans-serif;background:#f7f9fc;margin:0;padding:24px;color:#111827;">
            <div style="max-width:680px;margin:0 auto;background:#fff;border-radius:12px;box-shadow:0 8px 24px rgba(0,0,0,.08);overflow:hidden;">
              <div style="background:linear-gradient(135deg,#0a3fa3,#2b63d9);color:#fff;padding:18px 20px;">
                <strong>New newsletter signup</strong>
              </div>
              <div style="padding:18px 20px;line-height:1.6;">
                <table style="width:100%;border-collapse:collapse;">
                  <tr>
                    <td style="padding:6px 0;color:#6b7280;font-weight:600;width:160px;">Subscriber</td>
                    <td style="padding:6px 0;color:#111827;"><a href="mailto:${safeEmail}">${safeEmail}</a></td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#6b7280;font-weight:600;">Source</td>
                    <td style="padding:6px 0;color:#111827;">${escapeHtml(sourceLabel)}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#6b7280;font-weight:600;">Received</td>
                    <td style="padding:6px 0;color:#111827;">${escapeHtml(
                      timestampReadable
                    )} <span style="color:#9ca3af;">(${escapeHtml(
                      timestampIso
                    )})</span></td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;color:#6b7280;font-weight:600;">Request ID</td>
                    <td style="padding:6px 0;color:#111827;">${escapeHtml(
                      requestId
                    )}</td>
                  </tr>
                  ${safeOrigin ? `<tr><td style="padding:6px 0;color:#6b7280;font-weight:600;">Origin</td><td style="padding:6px 0;color:#111827;">${safeOrigin}</td></tr>` : ""}
                  ${safeReferer ? `<tr><td style="padding:6px 0;color:#6b7280;font-weight:600;">Referer</td><td style="padding:6px 0;color:#111827;">${safeReferer}</td></tr>` : ""}
                  ${safeRealIp ? `<tr><td style="padding:6px 0;color:#6b7280;font-weight:600;">IP</td><td style="padding:6px 0;color:#111827;">${safeRealIp}</td></tr>` : ""}
                  ${safeForwardedFor ? `<tr><td style="padding:6px 0;color:#6b7280;font-weight:600;">X-Forwarded-For</td><td style="padding:6px 0;color:#111827;">${safeForwardedFor}</td></tr>` : ""}
                </table>

                <div style="margin-top:14px;background:#f3f4f6;border-left:4px solid #0a3fa3;padding:12px 14px;border-radius:8px;">
                  <p style="margin:0 0 6px;font-weight:600;">Next steps</p>
                  <ul style="margin:0;padding-left:18px;color:#374151;">
                    <li>Add this email to your newsletter list (Mailchimp / Brevo / etc.).</li>
                    <li>If you don’t recognize this signup, you can ignore it.</li>
                  </ul>
                </div>

                <p style="margin:14px 0 0;color:#6b7280;font-size:12px;">This message was generated by KaeroPrescribe.</p>
              </div>
            </div>
          </body>
        </html>
      `.trim(),
    });

    if (debug) {
      console.log("[newsletter] sent", {
        requestId,
        messageId: (info as any)?.messageId,
        accepted: (info as any)?.accepted,
        rejected: (info as any)?.rejected,
      });
    }

    return NextResponse.json(
      { message: "Subscribed successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("[newsletter] error", {
      requestId,
      code: error?.code,
      command: error?.command,
      message: error?.message || String(error),
    });
    return NextResponse.json(
      {
        message: "Error subscribing.",
        error: error?.message || String(error),
      },
      { status: 500 }
    );
  }
}
