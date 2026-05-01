export const config = {
  runtime: "edge",
};

export default async function handler(req) {
  try {
    const url = new URL(req.url);
    const target = process.env.TARGET_DOMAIN;

    if (!target) {
      return new Response(null, { status: 500 });
    }

    const path = url.pathname.replace(/^\/api/, "");
    const search = url.search || "";
    const targetUrl = `https://${target}${path}${search}`;

    const headers = new Headers();
    req.headers.forEach((value, key) => {
      if (key.toLowerCase() === "host") return;
      headers.set(key, value);
    });

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: ["GET", "HEAD"].includes(req.method) ? null : req.body,
      redirect: "manual",
    });

    return response;
  } catch (err) {
    return new Response(null, { status: 500 });
  }
}
