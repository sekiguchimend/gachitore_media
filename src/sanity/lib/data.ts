import "server-only";

import { cache } from "react";
import type { QueryParams } from "@sanity/client";
import { sanityFetch } from "./fetch";
import {
  POST_QUERY,
  CATEGORY_QUERY,
  POSTS_PAGINATED_QUERY,
  CATEGORIES_NAV_QUERY,
  POST_SLUGS_LIMITED_QUERY,
  CATEGORY_SLUGS_QUERY,
} from "./queries";
import type { Category, Post } from "@/lib/types";

export type PostWithRelated = Post & { relatedPosts?: Post[] };

export const getPostBySlug = cache(async (slug: string) => {
  return sanityFetch<PostWithRelated | null>({
    query: POST_QUERY,
    params: { slug },
    tags: ["post"],
  });
});

export const getCategoryBySlug = cache(async (slug: string) => {
  return sanityFetch<Category | null>({
    query: CATEGORY_QUERY,
    params: { slug },
    tags: ["category"],
  });
});

export const getCategoriesNav = cache(async () => {
  return sanityFetch<Pick<Category, "title" | "slug">[]>({
    query: CATEGORIES_NAV_QUERY,
    tags: ["category"],
  });
});

export const getPostsPage = cache(async ({ start, end }: { start: number; end: number }) => {
  return sanityFetch<{ posts: Post[]; total: number }>({
    query: POSTS_PAGINATED_QUERY,
    params: { start, end } satisfies QueryParams,
    tags: ["post"],
  });
});

export const getRecentPostSlugsForStaticParams = cache(async (limit: number) => {
  return sanityFetch<{ slug: string }[]>({
    query: POST_SLUGS_LIMITED_QUERY,
    params: { limit },
    revalidate: false,
  });
});

export const getCategorySlugsForStaticParams = cache(async () => {
  return sanityFetch<{ slug: string }[]>({
    query: CATEGORY_SLUGS_QUERY,
    revalidate: false,
  });
});


