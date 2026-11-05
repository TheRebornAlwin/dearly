// Cloudflare Pages Function: POST /api/event
// Sends a copy of browser Pixel events to Meta's Conversions API from our server, so events
// blocked by browsers (Safari, ad blockers) are still counted. Meta deduplicates using event_id.
// Does nothing until these are set in Cloudflare (Pages project, Settings, Variables and Secrets):
//   META_CAPI_TOKEN   (secret)  access token from Meta Events Manager, Settings, Conversions API
//   META_PIXEL_ID     (optional, defaults to the Dearly pixel)
//   META_API_VERSION  (optional, defaults to v23.0)
//   META_TEST_CODE    (optional) test event code while checking in Events Manager

const ALLOWED = new Set(["PageView", "ViewContent", "InitiateCheckout"]);
const MAX_BODY = 4096;

export async function onRequestPost({ request, env, waitUntil }) {
  const token = env.META_CAPI_TOKEN;
  if (!token) return new Response(null, { status: 204 });

  const origin = request.headers.get("Origin") || "";
  const host = new URL(request.url).host;
  if (origin && new URL(origin).host !== host) return new Response(null, { status: 403 });

  const raw = await request.text();
  if (raw.length > MAX_BODY) return new Response(null, { status: 413 });
  let body;
  try { body = JSON.parse(raw); } catch { return new Response(null, { status: 400 }); }
  if (!ALLOWED.has(body.event_name) || typeof body.event_id !== "string" || body.event_id.length > 64) {
    return new Response(null, { status: 400 });
  }

  const cookies = Object.fromEntries((request.headers.get("Cookie") || "").split(/;\s*/).filter(Boolean).map(c => {
    const i = c.indexOf("="); return [c.slice(0, i), c.slice(i + 1)];
  }));
  const pageUrl = typeof body.url === "string" && body.url.startsWith(`https://${host}`) ? body.url : `https://${host}/`;
  const cd = body.custom_data && typeof body.custom_data === "object" ? body.custom_data : {};

  const event = {
    event_name: body.event_name,
    event_time: Math.floor(Date.now() / 1000),
    event_id: body.event_id,
    action_source: "website",
    event_source_url: pageUrl,
    user_data: {
      client_ip_address: request.headers.get("CF-Connecting-IP") || undefined,
      client_user_agent: request.headers.get("User-Agent") || undefined,
      fbp: cookies._fbp || undefined,
      fbc: cookies._fbc || undefined,
    },
    custom_data: {
      value: typeof cd.value === "number" ? cd.value : undefined,
      currency: typeof cd.currency === "string" ? cd.currency.slice(0, 3) : undefined,
      content_type: typeof cd.content_type === "string" ? cd.content_type.slice(0, 32) : undefined,
      num_items: typeof cd.num_items === "number" ? cd.num_items : undefined,
    },
  };

  const pixel = env.META_PIXEL_ID || "29461693903447213";
  const version = env.META_API_VERSION || "v23.0";
  const payload = { data: [event] };
  if (env.META_TEST_CODE) payload.test_event_code = env.META_TEST_CODE;

  waitUntil(fetch(`https://graph.facebook.com/${version}/${pixel}/events?access_token=${encodeURIComponent(token)}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  }).catch(() => {}));

  return new Response(null, { status: 204 });
}

export function onRequest() {
  return new Response(null, { status: 405, headers: { Allow: "POST" } });
}
