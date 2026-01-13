import type { MetadataRoute } from "next";
import { sanityFetch } from "@/sanity/lib/fetch";
import { POST_SLUGS_QUERY, CATEGORY_SLUGS_QUERY } from "@/sanity/lib/queries";
import { absoluteUrl } from "@/lib/seo";

export const revalidate = 3600; // 1時間

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories] = await Promise.all([
    sanityFetch<{ slug: string }[]>({ query: POST_SLUGS_QUERY, revalidate: 3600 }),
    sanityFetch<{ slug: string }[]>({ query: CATEGORY_SLUGS_QUERY, revalidate: 3600 }),
  ]);

  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: absoluteUrl("/posts"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/categories"),
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: absoluteUrl("/about"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.4,
    },
  ];

  const categoryRoutes: MetadataRoute.Sitemap = categories.map((c) => ({
    url: absoluteUrl(`/categories/${c.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((p) => ({
    url: absoluteUrl(`/posts/${p.slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...categoryRoutes, ...postRoutes];
}


