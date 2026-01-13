export const SITE_NAME = "gachitore";
export const DEFAULT_TITLE = "gachitore | ガチトレメディア";
export const DEFAULT_DESCRIPTION =
  "本気で鍛えたいあなたへ。トレーニング・フィットネスに関する最新情報をお届けするメディアサイト";
export const DEFAULT_KEYWORDS = ["トレーニング", "フィットネス", "筋トレ", "ワークアウト", "健康"] as const;

export function getSiteUrl(): string {
  // 例: https://example.com（末尾スラッシュなし推奨）
  const env = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (env) return env.replace(/\/+$/, "");
  // ローカル/未設定時のフォールバック（canonical/OGの整合性のため）
  return "http://localhost:3000";
}

export function absoluteUrl(pathname: string): string {
  const base = getSiteUrl();
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base}${path}`;
}

export function canonicalFrom(pathname: string, search?: string): string {
  const url = new URL(absoluteUrl(pathname));
  if (search) url.search = search;
  return url.toString();
}

export function jsonLdScript(jsonLd: unknown): string {
  // JSON-LDはHTMLに埋め込むため、改行・スペースは最小化
  return JSON.stringify(jsonLd);
}


