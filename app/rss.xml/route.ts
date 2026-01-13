import { sanityFetch } from "@/sanity/lib/fetch";
import { RSS_POSTS_QUERY } from "@/sanity/lib/queries";
import { SITE_NAME, absoluteUrl, getSiteUrl } from "@/lib/seo";

export const revalidate = 3600; // 1時間

function escapeXml(str: string) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const posts = await sanityFetch<
    { _id: string; title: string; slug: string; publishedAt?: string; excerpt?: string }[]
  >({
    query: RSS_POSTS_QUERY,
    revalidate,
    tags: ["post"],
  });

  const siteUrl = getSiteUrl();
  const now = new Date().toUTCString();

  const items = posts
    .map((p) => {
      const url = absoluteUrl(`/posts/${p.slug}`);
      const pubDate = p.publishedAt ? new Date(p.publishedAt).toUTCString() : now;
      const description = p.excerpt ? escapeXml(p.excerpt) : "";
      return `
  <item>
    <title>${escapeXml(p.title)}</title>
    <link>${url}</link>
    <guid isPermaLink="true">${url}</guid>
    <pubDate>${pubDate}</pubDate>
    ${description ? `<description>${description}</description>` : ""}
  </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${SITE_NAME}</title>
  <link>${siteUrl}</link>
  <description>${escapeXml("最新の記事をRSSで配信します。")}</description>
  <language>ja</language>
  <lastBuildDate>${now}</lastBuildDate>
  ${items}
</channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=3600",
    },
  });
}


