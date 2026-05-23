/*
  Christine's Skivvez Studio — Claude API proxy
  Deploy this as a Cloudflare Worker.

  It keeps your Anthropic API key server-side. The card studio page
  sends design requests here; this worker adds the key and forwards
  them to the Claude API, then returns the response.

  Setup:
  1. Paste this whole file into a new Cloudflare Worker.
  2. Add a secret named exactly  ANTHROPIC_API_KEY  with your key as the value.
  3. Deploy. Use the worker's URL as the AI endpoint in the app.

  The worker only answers requests from the site listed in ALLOWED_ORIGINS.
*/

const ALLOWED_ORIGINS = [
  "https://drsrennie-stack.github.io"
];

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
    const cors = {
      "Access-Control-Allow-Origin": allowOrigin,
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Vary": "Origin"
    };

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== "POST") {
      return json({ error: "Send a POST request." }, 405, cors);
    }
    if (!env.ANTHROPIC_API_KEY) {
      return json({ error: "The worker is missing its ANTHROPIC_API_KEY secret." }, 500, cors);
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return json({ error: "Request body was not valid JSON." }, 400, cors);
    }

    let upstream;
    try {
      upstream = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01"
        },
        body: JSON.stringify(body)
      });
    } catch (e) {
      return json({ error: "Could not reach the Claude API." }, 502, cors);
    }

    const text = await upstream.text();
    return new Response(text, {
      status: upstream.status,
      headers: { ...cors, "Content-Type": "application/json" }
    });
  }
};

function json(obj, status, cors) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...cors, "Content-Type": "application/json" }
  });
}
