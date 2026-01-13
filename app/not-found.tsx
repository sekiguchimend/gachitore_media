import Link from "next/link";
import { Metadata } from "next";
import { SITE_NAME, absoluteUrl, canonicalFrom } from "@/lib/seo";

export const metadata: Metadata = {
  title: "ページが見つかりません",
  description: "お探しのページは存在しないか、移動した可能性があります。",
  robots: { index: false, follow: true },
  alternates: { canonical: canonicalFrom("/404") },
};

export default function NotFound() {
  return (
    <div className="bg-black min-h-screen grid-bg pt-20">
      <div className="container">
        <div className="max-w-md mx-auto text-center py-20">
          <div className="mb-8">
            <span className="text-8xl font-bold text-[#00ff88] neon-text">404</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
            ページが見つかりません
          </h1>
          <p className="text-[#888] mb-8 text-sm">
            お探しのページは存在しないか、移動した可能性があります。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#00ff88] text-black font-bold font-mono text-sm hover:bg-white transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              トップページへ戻る
            </Link>
            <Link
              href="/posts"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#333] text-[#888] hover:border-[#00ff88] hover:text-[#00ff88] transition-colors font-mono text-sm"
            >
              記事一覧を見る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

