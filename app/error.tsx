"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // エラーログを記録（本番環境では外部サービスに送信）
    console.error("Application error:", error);
  }, [error]);

  return (
    <div className="bg-black min-h-screen grid-bg pt-20">
      <div className="container">
        <div className="max-w-md mx-auto text-center py-20">
          <div className="mb-8">
            <span className="text-8xl font-bold text-[#00ff88] neon-text">500</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
            エラーが発生しました
          </h1>
          <p className="text-[#888] mb-8 text-sm">
            申し訳ございません。予期しないエラーが発生しました。
            {error.digest && (
              <span className="block mt-2 text-xs text-[#666] font-mono">
                エラーID: {error.digest}
              </span>
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#00ff88] text-black font-bold font-mono text-sm hover:bg-white transition-colors"
            >
              もう一度試す
            </button>
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-[#333] text-[#888] hover:border-[#00ff88] hover:text-[#00ff88] transition-colors font-mono text-sm"
            >
              トップページへ戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

