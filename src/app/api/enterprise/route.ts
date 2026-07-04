import { NextResponse } from "next/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Enterprise "Book a demo" lead capture. Adds the contact to Loops, tagged as
 * an enterprise lead, and fires a `requestedDemo` event carrying the operation
 * details so a sales automation can route it. The Loops API key is read
 * server-side from LOOPS_API_KEY and never reaches the browser.
 *
 * NOTE: `company`, `storeUrl`, `volume` and `message` are custom contact
 * properties — they persist on the Loops contact only once the matching
 * properties exist in the Loops dashboard. They are also sent as event
 * properties (which need no setup) so no detail is ever lost.
 */
export async function POST(req: Request) {
  let email = "";
  let name = "";
  let company = "";
  let storeUrl = "";
  let volume = "";
  let message = "";
  try {
    const body = await req.json();
    email = String(body?.email ?? "").trim();
    name = String(body?.name ?? "").trim();
    company = String(body?.company ?? "").trim();
    storeUrl = String(body?.storeUrl ?? "").trim();
    volume = String(body?.volume ?? "").trim();
    message = String(body?.message ?? "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Enter a valid work email." },
      { status: 400 },
    );
  }
  if (!company) {
    return NextResponse.json(
      { error: "Tell us your company name." },
      { status: 400 },
    );
  }

  const key = process.env.LOOPS_API_KEY;
  if (!key) {
    return NextResponse.json(
      { error: "Demo requests are not configured." },
      { status: 500 },
    );
  }

  const details = { company, storeUrl, volume, message };

  try {
    const res = await fetch("https://app.loops.so/api/v1/contacts/create", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        firstName: name || undefined,
        source: "Vantage enterprise demo",
        userGroup: "Enterprise",
        subscribed: true,
        ...details,
      }),
    });

    const data = (await res.json().catch(() => ({}))) as {
      success?: boolean;
      message?: string;
    };

    const already =
      res.status === 409 ||
      (typeof data?.message === "string" && /already/i.test(data.message));
    const created = res.ok && data?.success === true;

    if (created || already) {
      // Fire the demo-request event so a sales/notify automation can pick it up
      // with the full operation details. Best-effort — never fail the lead.
      try {
        await fetch("https://app.loops.so/api/v1/events/send", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${key}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            eventName: "requestedDemo",
            eventProperties: { name, ...details },
          }),
        });
      } catch {
        // routing is non-critical — never fail the lead over it
      }
      return NextResponse.json({ ok: true, already: Boolean(already) });
    }

    return NextResponse.json(
      { error: data?.message || "Could not send your request. Try again." },
      { status: 502 },
    );
  } catch {
    return NextResponse.json(
      { error: "Could not reach us. Try again." },
      { status: 502 },
    );
  }
}
