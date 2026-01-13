import Link from "next/link";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages: (number | string)[] = [];
  const showEllipsisStart = currentPage > 3;
  const showEllipsisEnd = currentPage < totalPages - 2;

  // ページ番号の生成
  for (let i = 1; i <= totalPages; i++) {
    if (
      i === 1 ||
      i === totalPages ||
      (i >= currentPage - 1 && i <= currentPage + 1)
    ) {
      pages.push(i);
    } else if (i === 2 && showEllipsisStart) {
      pages.push("...");
    } else if (i === totalPages - 1 && showEllipsisEnd) {
      pages.push("...");
    }
  }

  // 重複する省略記号を削除
  const uniquePages = pages.filter(
    (page, index, arr) => page !== "..." || arr[index - 1] !== "..."
  );

  const getPageUrl = (page: number) => {
    if (page === 1) return basePath;
    return `${basePath}?page=${page}`;
  };

  return (
    <nav className="flex items-center justify-center gap-2 mt-12" aria-label="ページネーション">
      {/* 前へ */}
      {currentPage > 1 ? (
        <Link
          href={getPageUrl(currentPage - 1)}
          className="px-3 py-2 border border-[#333] text-[#888] hover:border-[#00ff88] hover:text-[#00ff88] transition-colors font-mono text-xs"
        >
          ← PREV
        </Link>
      ) : (
        <span className="px-3 py-2 border border-[#1a1a1a] text-[#333] font-mono text-xs cursor-not-allowed">
          ← PREV
        </span>
      )}

      {/* ページ番号 */}
      <div className="flex items-center gap-1">
        {uniquePages.map((page, index) =>
          page === "..." ? (
            <span key={`ellipsis-${index}`} className="px-2 text-[#555]">
              ...
            </span>
          ) : (
            <Link
              key={page}
              href={getPageUrl(page as number)}
              className={`w-10 h-10 flex items-center justify-center font-mono text-sm transition-colors ${
                currentPage === page
                  ? "bg-[#00ff88] text-black font-bold"
                  : "border border-[#333] text-[#888] hover:border-[#00ff88] hover:text-[#00ff88]"
              }`}
            >
              {page}
            </Link>
          )
        )}
      </div>

      {/* 次へ */}
      {currentPage < totalPages ? (
        <Link
          href={getPageUrl(currentPage + 1)}
          className="px-3 py-2 border border-[#333] text-[#888] hover:border-[#00ff88] hover:text-[#00ff88] transition-colors font-mono text-xs"
        >
          NEXT →
        </Link>
      ) : (
        <span className="px-3 py-2 border border-[#1a1a1a] text-[#333] font-mono text-xs cursor-not-allowed">
          NEXT →
        </span>
      )}
    </nav>
  );
}

