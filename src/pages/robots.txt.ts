import type { APIRoute } from "astro";

export const GET: APIRoute = ({ site }) => {
  const shouldIndex = import.meta.env.PUBLIC_INDEX_SITE === "true";
  const sitemapUrl = new URL("/sitemap-index.xml", site ?? "https://setagayagrace.jp");
  const rules = shouldIndex ? "User-agent: *\nAllow: /\n" : "User-agent: *\nAllow: /\n";

  return new Response(`${rules}\nSitemap: ${sitemapUrl.href}\n`, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
};
