import { createClient } from "@sanity/client";

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "8aikdr31";
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-01-13";

// 本番環境ではCDNを使用、開発環境では直接APIにアクセス
const isDev = process.env.NODE_ENV === "development";

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  // 本番: CDN使用で高速化、開発: 最新データを取得
  useCdn: !isDev,
  // stega（プレビュー用のメタデータ）は本番では無効化
  stega: {
    enabled: false,
  },
});

