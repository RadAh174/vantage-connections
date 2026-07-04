import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Closed-beta waitlist capture. Adds the email to Loops as a contact.
 * The Loops API key is read server-side from LOOPS_API_KEY and never reaches
 * the browser.
 */
export async function POST(req: Request) {
  let email = "";
  let plan: string | undefined;
  try {
    const body = await req.json();
    email = String(body?.email ?? "").trim();
    plan = body?.plan ? String(body.plan) : undefined;
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  const key = process.env.LOOPS_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "Waitlist is not configured." },
      { status: 500 },
    );
  }

  try {
    const res = await fetch("https://app.loops.so/api/v1/contacts/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        source: plan ? `Vantage Connections waitlist · ${plan}` : "Vantage Connections waitlist",
        subscribed: true,
      }),
    });

    const data = (await res.json().catch(() => ({}))) as {
      success?: boolean;
      message?: string;
    };

    // Already on the list counts as success.
    const already =
      res.status === 409 ||
      (typeof data?.message === "string" && /already/i.test(data.message));
    const created = res.ok && data?.success === true;

    if (created || already) {
      // Fire a Loops event for new signups so a "welcome / you're on the list"
      // automation can send the confirmation email. Best-effort.
      if (created) {
        try {
          await fetch("https://app.loops.so/api/v1/events/send", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${key}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email,
              eventName: "joinedWaitlist",
              eventProperties: plan ? { plan } : {},
            }),
          });
        } catch {
          // confirmation is non-critical — never fail the signup over it
        }
      }
      return NextResponse.json({ ok: true, already: Boolean(already) });
    }

    return NextResponse.json(
      { error: data?.message || "Could not join the waitlist. Try again." },
      { status: 502 },
    );
  } catch {
    return NextResponse.json(
      { error: "Could not reach the waitlist. Try again." },
      { status: 502 },
    );
  }
}
