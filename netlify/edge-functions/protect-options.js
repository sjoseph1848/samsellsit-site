/**
 * Password-protects private client pages under /options/<client>/.
 *
 * Each client page has its own password, stored as a Netlify environment
 * variable (never in this repo; the repo is public):
 *   /options/paul-jennifer/  ->  PW_PAUL_JENNIFER
 *
 * The browser shows its built-in login box. Any username works; only the
 * password is checked. If the variable is not set, the page stays locked.
 */
export default async (request, context) => {
  const url = new URL(request.url);
  const slug = (url.pathname.split("/")[2] || "").toLowerCase();
  if (!slug) return context.next();

  const varName = "PW_" + slug.replace(/[^a-z0-9]+/g, "_").toUpperCase();
  const expected = Netlify.env.get(varName);

  const locked = (msg) =>
    new Response(msg, {
      status: 401,
      headers: {
        "WWW-Authenticate": 'Basic realm="Sam Sells It - private page", charset="UTF-8"',
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-store",
        "X-Robots-Tag": "noindex, nofollow",
      },
    });

  if (!expected) return locked("This page is private and not open yet. Contact Sam Joseph at (737) 277-7519.");

  const auth = request.headers.get("authorization") || "";
  if (auth.startsWith("Basic ")) {
    try {
      const decoded = atob(auth.slice(6));
      const password = decoded.slice(decoded.indexOf(":") + 1);
      if (await sameText(password, expected)) {
        const res = await context.next();
        res.headers.set("Cache-Control", "private, no-store");
        return res;
      }
    } catch (_) {
      /* fall through to locked */
    }
  }
  return locked("Password required. Contact Sam Joseph at (737) 277-7519 if you need it.");
};

// Constant-time comparison via SHA-256 digests.
async function sameText(a, b) {
  const enc = new TextEncoder();
  const [ha, hb] = await Promise.all([
    crypto.subtle.digest("SHA-256", enc.encode(a)),
    crypto.subtle.digest("SHA-256", enc.encode(b)),
  ]);
  const x = new Uint8Array(ha), y = new Uint8Array(hb);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

export const config = { path: "/options/*" };
