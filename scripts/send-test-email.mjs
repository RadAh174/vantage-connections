// One-shot script to verify the Resend integration + email design.
// Run from the project root with: node scripts/send-test-email.mjs
//
// Reads RESEND_API_KEY and LEAD_RECIPIENT_EMAIL out of .env.local,
// renders the same lead-template HTML the /contact form uses, and
// POSTs straight to api.resend.com so we don't need a running Next
// dev server or to invoke the server action through a browser.

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// --- Load .env.local --------------------------------------------------
function loadEnv() {
  const envPath = resolve(process.cwd(), ".env.local");
  let raw = "";
  try {
    raw = readFileSync(envPath, "utf8");
  } catch {
    throw new Error(`Cannot read .env.local at ${envPath}`);
  }
  const env = {};
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    env[key] = value;
  }
  return env;
}

const env = loadEnv();
const apiKey = env.RESEND_API_KEY;
const recipient = env.LEAD_RECIPIENT_EMAIL;
if (!apiKey) throw new Error("RESEND_API_KEY missing from .env.local");
if (!recipient) throw new Error("LEAD_RECIPIENT_EMAIL missing from .env.local");

// --- Email rendering (mirrors app/actions/contact.ts) ----------------
function esc(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function renderLeadHtml(p) {
  const rows = [
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
    `<table width="600" cellpadding="0" cellspacing="0" border="0" bgcolor="#1A1A1C" style="max-width:600px;width:100%;background-color:#1A1A1C;background-image:radial-gradient(ellipse 600px 450px at 12% 18%, rgba(212,158,15,0.20) 0%, rgba(212,158,15,0.04) 40%, transparent 70%), radial-gradient(ellipse 500px 380px at 88% 65%, rgba(224,180,66,0.22) 0%, rgba(224,180,66,0.06) 35%, transparent 65%), radial-gradient(ellipse 350px 260px at 95% 95%, rgba(250,220,133,0.10) 0%, transparent 55%);border-radius:14px;overflow:hidden;box-shadow:0 8px 32px rgba(0,0,0,0.45);">`,
    `<tr><td style="height:3px;background:linear-gradient(90deg,#8B6914 0%,#D49E0F 30%,#FADC85 50%,#D49E0F 70%,#8B6914 100%);font-size:0;line-height:0;">&nbsp;</td></tr>`,
    `<tr><td style="padding:40px 44px 36px;">`,
    `<p style="margin:0 0 24px;font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.22em;text-transform:uppercase;color:#3D7755;font-weight:500;">VANTAGE CONNECTIONS</p>`,
    `<h1 style="margin:0 0 6px;font-family:Georgia,serif;font-weight:500;font-size:30px;line-height:1.1;letter-spacing:-0.01em;color:#F8F5EE;">New lead.</h1>`,
    `<p style="margin:0 0 28px;font-family:Georgia,serif;font-style:italic;font-size:15px;color:#9B9B9E;">from vantageconnections.com</p>`,
    `<table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="height:1px;background:#2A2A2D;font-size:0;line-height:0;">&nbsp;</td></tr></table>`,
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:20px;">${rowsHtml}</table>`,
    `<p style="margin:28px 0 10px;font-family:'Courier New',monospace;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#E0B442;font-weight:500;">Message</p>`,
    `<p style="margin:0;font-family:Georgia,serif;font-size:15px;line-height:1.65;color:#F8F5EE;white-space:pre-wrap;">${esc(p.message)}</p>`,
    `<table width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:32px;"><tr><td style="height:1px;background:linear-gradient(90deg,transparent 0%,rgba(224,180,66,0.55) 50%,transparent 100%);font-size:0;line-height:0;">&nbsp;</td></tr></table>`,
    `<p style="margin:18px 0 0;font-family:Georgia,serif;font-style:italic;font-size:13px;color:#9B9B9E;">Reply directly to this email to respond — it'll go straight to ${esc(p.email)}.</p>`,
    `</td></tr>`,
    `</table>`,
    `<p style="margin:18px 0 0;font-family:'Courier New',monospace;font-size:10px;letter-spacing:0.22em;text-transform:uppercase;color:#5A5A5D;">Vantage Connections — California</p>`,
    `</td></tr>`,
    `</table>`,
    `</body></html>`,
  ].join("");
}

function renderLeadText(p) {
  const lines = [
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

// --- Test payload ----------------------------------------------------
const payload = {
  name: "Test Lead",
  email: "test@example.com",
  phone: "+1.949.966.9075",
  company: "Acme Inc",
  projectType: "SaaS",
  budget: "$15k+",
  message:
    "Hello! This is a TEST email from the Vantage Connections contact form to preview the lead notification design.\n\nThe brand palette (forest + gold + cream) is now applied. The actual content will reflect whatever a real lead types into the form on the site.\n\nThanks!",
  source: "contact-page",
};

const subject = `[TEST] [Vantage Lead] ${payload.name} · ${payload.company}`;

const body = {
  from: "Vantage Connections <onboarding@resend.dev>",
  to: recipient,
  subject,
  reply_to: payload.email,
  html: renderLeadHtml(payload),
  text: renderLeadText(payload),
};

console.log(`Sending test → ${recipient}`);
const res = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify(body),
});

const json = await res.json();
console.log("Status:", res.status);
console.log("Response:", JSON.stringify(json, null, 2));

if (!res.ok) {
  process.exit(1);
}
