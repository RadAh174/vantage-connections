"use server";

import { Resend } from "resend";

/**
 * Lead-capture server action.
 *
 * Single entry point for every lead-capture surface (contact page,
 * home drawer, AI assistant, etc). Validates server-side, then sends
 * a transactional email to LEAD_RECIPIENT_EMAIL via Resend.
 *
 * Resend sandbox sender (onboarding@resend.dev) is used until the
 * studio's domain is verified — Resend restricts sandbox sends to the
 * account-owner's email, but that's exactly where leads should land
 * anyway, so it's fine.
 */

export type LeadPayload = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  projectType?: string;
  budget?: string;
  message: string;
  /** Which surface the lead originated from — useful for triage. */
  source: "contact-page" | "home-drawer";
};

export type LeadResult = { ok: true } | { ok: false; error: string };

const SANDBOX_FROM = "Vantage Connections <onboarding@resend.dev>";

export async function sendLead(payload: LeadPayload): Promise<LeadResult> {
  // Server-side validation. The form already validates client-side,
  // but never trust the client — the action is callable directly.
  const name = payload.name?.trim() ?? "";
  const email = payload.email?.trim() ?? "";
  const message = payload.message?.trim() ?? "";

  if (!name) return { ok: false, error: "Name is required." };
  if (!email) return { ok: false, error: "Email is required." };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Email looks invalid." };
  }
  if (!message) return { ok: false, error: "Message is required." };

  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.LEAD_RECIPIENT_EMAIL;
  if (!apiKey || !recipient) {
    console.error(
      "[sendLead] Missing RESEND_API_KEY or LEAD_RECIPIENT_EMAIL env var.",
    );
    return { ok: false, error: "Email service is not configured." };
  }

  const resend = new Resend(apiKey);

  const subject = `[Vantage Lead] ${name}${
    payload.company?.trim() ? ` · ${payload.company.trim()}` : ""
  }`;

  const safe: LeadPayload = {
    ...payload,
    name,
    email,
    message,
    phone: payload.phone?.trim() || undefined,
    company: payload.company?.trim() || undefined,
    projectType: payload.projectType?.trim() || undefined,
    budget: payload.budget?.trim() || undefined,
  };

  try {
    const { data, error } = await resend.emails.send({
      from: SANDBOX_FROM,
      to: recipient,
      subject,
      replyTo: email,
      html: renderLeadHtml(safe),
      text: renderLeadText(safe),
    });

    if (error) {
      console.error("[sendLead] Resend error:", error);
      return {
        ok: false,
        error: error.message ?? "Email failed to send.",
      };
    }

    console.log("[sendLead] Sent:", data?.id);
    return { ok: true };
  } catch (err) {
    console.error("[sendLead] Threw:", err);
    return { ok: false, error: "Email failed to send." };
  }
}

// --- Email body renderers ---------------------------------------------

function renderLeadHtml(p: LeadPayload): string {
  // Brand palette — DARK MODE (mirrors the site's dark theme):
  //   bg     #0E0E10 — outer page
  //   card   #1A1A1C — surface
  //   ink    #F8F5EE — primary text (cream)
  //   muted  #9B9B9E — secondary text
  //   line   #2A2A2D — hairline divider
  //   forest #3D7755 — wordmark / accent
  //   gold   #E0B442 — labels / accent
  //   gold   #FADC85 — gradient highlight
  const rows: Array<[string, string]> = [
    ["Name", p.name],
    ["Email", p.email],
  ];
  if (p.phone) rows.push(["Phone", p.phone]);
  if (p.company) rows.push(["Company", p.company]);
  if (p.projectType) rows.push(["Project type", p.projectType]);
  if (p.budget) rows.push(["Budget", p.budget]);
  rows.push(["Source", p.source]);

  const rowsHtml = rows
    .map(
      ([k, v]) =>
        `<tr>
          <td style="padding:10px 16px 10px 0;width:120px;vertical-align:top;font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#E0B442;">${esc(k)}</td>
          <td style="padding:10px 0;vertical-align:top;font-family:Georgia,serif;font-size:15px;line-height:1.5;color:#F8F5EE;">${esc(v)}</td>
        </tr>`,
    )
    .join("");

  return [
    `<!doctype html>`,
    `<html><body style="margin:0;padding:0;background:#0E0E10;">`,
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#0E0E10;">`,
    `<tr><td align="center" style="padding:40px 20px;">`,
    // Card. Solid `#1A1A1C` is the Outlook-desktop fallback; modern
    // clients (Gmail, Apple Mail, iOS, webmail) layer three radial
    // gradients on top to produce diffuse gold "blobs" that bleed
    // warm light into the dark surface, matching the studio's
    // proposal-doc atmosphere.
    `<table width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#1A1A1C" style="max-width:600px;width:100%;background-color:#1A1A1C;background-image:radial-gradient(ellipse 600px 450px at 12% 18%, rgba(212,158,15,0.20) 0%, rgba(212,158,15,0.04) 40%, transparent 70%), radial-gradient(ellipse 500px 380px at 88% 65%, rgba(224,180,66,0.22) 0%, rgba(224,180,66,0.06) 35%, transparent 65%), radial-gradient(ellipse 350px 260px at 95% 95%, rgba(250,220,133,0.10) 0%, transparent 55%);border-radius:14px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.45);">`,
    // Top gold-gradient hairline (3px)
    `<tr><td style="height:3px;background:linear-gradient(90deg,#8B6914 0%,#D49E0F 30%,#FADC85 50%,#D49E0F 70%,#8B6914 100%);font-size:0;line-height:0;">&nbsp;</td></tr>`,
    // Card body
    `<tr><td style="padding:40px 44px 36px;">`,
    // Wordmark
    `<p style="margin:0 0 24px;font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#3D7755;font-weight:500;">VANTAGE CONNECTIONS</p>`,
    // Heading
    `<h1 style="margin:0 0 6px;font-family:Georgia,serif;font-weight:500;font-size:30px;line-height:1.1;letter-spacing:-0.01em;color:#F8F5EE;">New lead.</h1>`,
    `<p style="margin:0 0 28px;font-family:Georgia,serif;font-style:italic;font-size:15px;color:#9B9B9E;">from vantageconnections.com</p>`,
    // Hairline
    `<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="height:1px;background:#2A2A2D;font-size:0;line-height:0;">&nbsp;</td></tr></table>`,
    // Field rows
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;">${rowsHtml}</table>`,
    // Message section
    `<p style="margin:28px 0 10px;font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#E0B442;font-weight:500;">Message</p>`,
    `<p style="margin:0;font-family:Georgia,serif;font-size:15px;line-height:1.65;color:#F8F5EE;white-space:pre-wrap;">${esc(p.message)}</p>`,
    // Footer gold rule
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:32px;"><tr><td style="height:1px;background:linear-gradient(90deg,transparent 0%,rgba(224,180,66,0.55) 50%,transparent 100%);font-size:0;line-height:0;">&nbsp;</td></tr></table>`,
    // Footer note
    `<p style="margin:18px 0 0;font-family:Georgia,serif;font-style:italic;font-size:13px;color:#9B9B9E;">Reply directly to this email to respond — it'll go straight to ${esc(p.email)}.</p>`,
    `</td></tr>`,
    `</table>`,
    // Outer wordmark line
    `<p style="margin:18px 0 0;font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:#5A5A5D;">Vantage Connections — California</p>`,
    `</td></tr>`,
    `</table>`,
    `</body></html>`,
  ].join("");
}

function renderLeadText(p: LeadPayload): string {
  const lines: string[] = [
    "New lead from vantageconnections.com",
    "",
    `Name: ${p.name}`,
    `Email: ${p.email}`,
  ];
  if (p.phone) lines.push(`Phone: ${p.phone}`);
  if (p.company) lines.push(`Company: ${p.company}`);
  if (p.projectType) lines.push(`Project type: ${p.projectType}`);
  if (p.budget) lines.push(`Budget: ${p.budget}`);
  lines.push(`Source: ${p.source}`, "", "Message:", p.message);
  return lines.join("\n");
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
