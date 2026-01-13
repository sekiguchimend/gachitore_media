import { client } from "./client";
import type { QueryParams } from "@sanity/client";

export async function sanityFetch<T>({
  query,
  params = {},
  revalidate = 60,
  tags = [],
}: {
  query: string;
  params?: QueryParams;
  revalidate?: number | false;
  tags?: string[];
}): Promise<T> {
  try {
    return await client.fetch<T>(query, params, {
      next: {
        revalidate,
        tags,
      },
    });
  } catch (error) {
    console.error("Sanity fetch error:", error);
    // エラーを再スローしてNext.jsのエラーハンドリングに委譲
    throw error;
  }
}

