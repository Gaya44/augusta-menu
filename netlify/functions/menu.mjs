import { getStore } from "@netlify/blobs";

// Must match EDIT_PASSWORD in public/index.html
const EDIT_PASSWORD = "227augusta229!";

export const handler = async (event) => {
  const store = getStore("augusta-menu");

  if (event.httpMethod === "GET") {
    const data = await store.get("menu-data", { type: "json" });
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data || null),
    };
  }

  if (event.httpMethod === "POST") {
    let body;
    try {
      body = JSON.parse(event.body || "{}");
    } catch (e) {
      return {
        statusCode: 400,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Bad request" }),
      };
    }

    if (body.password !== EDIT_PASSWORD) {
      return {
        statusCode: 401,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "Wrong password" }),
      };
    }

    await store.setJSON("menu-data", body.data);
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ok: true }),
    };
  }

  return { statusCode: 405, body: "Method not allowed" };
};
