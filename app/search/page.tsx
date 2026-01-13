import Link from "next/link";
import Image from "next/image";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SEARCH_POSTS_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { Post } from "@/lib/types";
import type { Metadata } from "next";
import { SITE_NAME, absoluteUrl, canonicalFrom } from "@/lib/seo";

export const revalidate = 60;

interface SearchPageProps {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: SearchPageProps): Promise<Metadata> {
  const params = await searchParams;
  const q = (params.q || "").trim();
  const title = q ? `「${q}」の検索結果` : "検索";
  const description = q ? `「${q}」の検索結果ページです。` : "サイト内の記事を検索できます。";

  // 検索結果ページは基本的にnoindex（重複・薄いページになりやすい）
  const queryString = q ? `q=${encodeURIComponent(q)}` : "";

  return {
    title,
    description,
    robots: { index: false, follow: true },
    alternates: { canonical: canonicalFrom("/search", queryString) },
    openGraph: {
      type: "website",
      url: absoluteUrl(`/search${queryString ? `?${queryString}` : ""}`),
      title,
      description,
      siteName: SITE_NAME,
      locale: "ja_JP",
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const query = params.q || "";
  
  let posts: Post[] = [];
  
  if (query.trim()) {
    posts = await sanityFetch<Post[]>({
      query: SEARCH_POSTS_QUERY,
      params: { query: query.trim() },
      // 検索はクエリの種類が多くキャッシュが肥大化しやすいので、基本はキャッシュしない
      revalidate: 0,
      tags: ["post"],
    });
  }

  return (
    <div className="bg-black min-h-screen grid-bg pt-20">
      <main className="container py-8">
        {/* Search Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-8 bg-[#00ff88]" />
            <h1 className="text-2xl md:text-3xl font-bold text-white">検索結果</h1>
          </div>
          {query && (
            <p className="text-[#888] font-mono text-sm" aria-label="検索結果件数">
              &quot;{query}&quot; の検索結果: <span className="text-[#00ff88]">{posts.length}件</span>
            </p>
          )}
        </header>

        {/* No Query State */}
        {!query && (
          <section className="flex flex-col items-center justify-center py-20" aria-label="検索キーワード未入力">
            <div className="w-20 h-20 rounded-full bg-[#111] border border-[#222] flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-[#333]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p className="text-[#666] text-lg mb-2">検索キーワードを入力してください</p>
            <p className="text-[#444] text-sm">ヘッダーの検索バーから記事を検索できます</p>
          </section>
        )}

        {/* No Results State */}
        {query && posts.length === 0 && (
          <section className="flex flex-col items-center justify-center py-20" aria-label="検索結果なし">
            <div className="w-20 h-20 rounded-full bg-[#111] border border-[#222] flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-[#333]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 20a8 8 0 100-16 8 8 0 000 16z" />
              </svg>
            </div>
            <p className="text-[#666] text-lg mb-2">該当する記事が見つかりませんでした</p>
            <p className="text-[#444] text-sm mb-6">別のキーワードで検索してみてください</p>
            <Link
              href="/posts"
              className="px-6 py-3 border border-[#333] text-[#888] hover:border-[#00ff88] hover:text-[#00ff88] transition-colors font-mono text-sm"
            >
              すべての記事を見る
            </Link>
          </section>
        )}

        {/* Search Results Grid */}
        {posts.length > 0 && (
          <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3" aria-label="検索結果一覧">
            {posts.map((post) => (
              <article key={post._id} className="group bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#00ff88]/50 transition-all duration-300">
                <Link href={`/posts/${post.slug}`} className="block">
                  {/* Thumbnail */}
                  <div className="relative aspect-video overflow-hidden">
                    {post.mainImage?.asset?.url ? (
                      <Image
                        src={urlFor(post.mainImage).width(640).height(360).quality(80).url()}
                        alt={post.mainImage.alt || post.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-[#111]" />
                    )}
                    {/* Category Badge */}
                    {post.categories?.[0] && (
                      <span className="absolute top-3 left-3 px-2 py-1 bg-[#00ff88] text-black text-[10px] font-bold font-mono">
                        {post.categories[0].title}
                      </span>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="p-4">
                    <h2 className="text-white font-bold text-lg group-hover:text-[#00ff88] transition-colors line-clamp-2 mb-2">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-[#666] text-sm line-clamp-2 mb-3">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-[#555] font-mono">
                      {post.author?.name && (
                        <>
                          <span>{post.author.name}</span>
                          <span>•</span>
                        </>
                      )}
                      {post.publishedAt && (
                        <time dateTime={post.publishedAt}>
                          {new Date(post.publishedAt).toLocaleDateString("ja-JP")}
                        </time>
                      )}
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  );
}

