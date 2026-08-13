import { getStore } from "@netlify/blobs";

// Must match EDIT_PASSWORD in public/index.html
const EDIT_PASSWORD = "227augusta229!";

export default async (req) => {
  const store = getStore("augusta-menu");

  if (req.method === "GET") {
    const data = await store.get("menu-data", { type: "json" });
    return new Response(JSON.stringify(data || null), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (req.method === "POST") {
    let body;
    try {
      body = await req.json();
    } catch (e) {
      return new Response(JSON.stringify({ error: "Bad request" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (body.password !== EDIT_PASSWORD) {
      return new Response(JSON.stringify({ error: "Wrong password" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    await store.setJSON("menu-data", body.data);
    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" },
    });
  }

  return new Response("Method not allowed", { status: 405 });
};

// No custom config.path here on purpose -- this keeps the function at its
// default URL (/.netlify/functions/menu), which the site already calls.
