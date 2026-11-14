const unavailableHeaders = { "cache-control": "no-store", "retry-after": "60" };

async function unavailable(request, env) {
  const url = new URL(request.url);
  if (url.pathname === "/fuwa/" && request.method !== "HEAD") {
    const page = await env.ASSETS.fetch(
      new Request(new URL("/fuwa-offline.html", url)),
    );
    return new Response(page.body, {
      status: 503,
      headers: {
        ...unavailableHeaders,
        "content-type": "text/html; charset=utf-8",
      },
    });
  }
  return new Response(
    request.method === "HEAD" ? null : JSON.stringify({ status: "offline" }),
    {
      status: 503,
      headers: { ...unavailableHeaders, "content-type": "application/json" },
    },
  );
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (["/assets/reel-preview.mp4", "/assets/reel-poster.jpg", "/assets/playground.webp"].includes(url.pathname)) {
      return new Response("This asset has been removed.", { status: 410, headers: { "cache-control": "no-store", "content-type": "text/plain; charset=utf-8" } });
    }
    if (url.pathname === "/fuwa") {
      url.pathname = "/fuwa/";
      return Response.redirect(url.toString(), 308);
    }
    if (!url.pathname.startsWith("/fuwa/")) return env.ASSETS.fetch(request);
    // Enable only after the exported client and backend Origin allowlist pass acceptance.
    if (env.FUWA_READY !== "true" || !env.FUWA_ORIGIN)
      return unavailable(request, env);
    let origin;
    try {
      origin = new URL(env.FUWA_ORIGIN);
    } catch {
      return unavailable(request, env);
    }
    if (
      origin.protocol !== "https:" ||
      origin.host === url.host ||
      origin.pathname !== "/" ||
      origin.search ||
      origin.hash ||
      origin.username ||
      origin.password
    )
      return unavailable(request, env);
    origin.pathname = url.pathname.slice("/fuwa".length);
    origin.search = url.search;
    const upstream = new Request(origin, request);
    upstream.headers.delete("host");
    upstream.headers.delete("x-forwarded-host");
    // Preserve Origin for backend validation; never replace it with the tunnel hostname.
    try {
      const response = await fetch(upstream, {
        redirect: "manual",
        cf: { cacheTtl: 0, cacheEverything: false },
      });
      if (response.status >= 500) return unavailable(request, env);
      // Pass through upgrades, compressed streams, ranges and ETags without buffering.
      return response;
    } catch {
      return unavailable(request, env);
    }
  },
};
