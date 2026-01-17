import Link from "next/link";
import Image from "next/image";
import { sanityFetch } from "@/sanity/lib/fetch";
import { HOME_PAGE_QUERY } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { Post, Category } from "@/lib/types";
import type { Metadata } from "next";
import { DEFAULT_DESCRIPTION, SITE_NAME, absoluteUrl, canonicalFrom } from "@/lib/seo";

// ISR: 60秒でキャッシュを再検証
export const revalidate = 60;

export const metadata: Metadata = {
  title: { absolute: "ガチトレ" },
  description: DEFAULT_DESCRIPTION,
  alternates: {
    canonical: canonicalFrom("/"),
  },
  openGraph: {
    type: "website",
    url: absoluteUrl("/"),
    title: "ガチトレ",
    description: DEFAULT_DESCRIPTION,
    siteName: SITE_NAME,
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "ガチトレ",
    description: DEFAULT_DESCRIPTION,
  },
};

// カテゴリーに記事を含む型
type CategoryWithPosts = Category & { posts: Post[] };

// ホームページデータの型
type HomePageData = {
  featured: Post[];
  latest: Post[];
  categories: CategoryWithPosts[];
};

// 横スクロールの記事行コンポーネント
function ArticleRow({ title, posts, href }: { title: string; posts: Post[]; href?: string }) {
  if (!posts || posts.length === 0) return null;
  
  return (
    <section className="mb-10">
      {/* Section Header */}
      <div className="container flex items-center justify-between mb-4">
        <h2 className="text-sm text-[#00ff88] font-mono tracking-wider uppercase">{title}</h2>
        {href && (
          <Link href={href} className="text-xs text-[#666] hover:text-[#00ff88] transition-colors font-mono">
            VIEW ALL →
          </Link>
        )}
      </div>
      
      {/* Horizontal Scroll */}
      <div className="relative">
        <div className="flex gap-4 overflow-x-auto hide-scrollbar px-4 md:px-8 pb-4">
          {posts.map((post) => (
            <Link
              key={post._id}
              href={`/posts/${post.slug}`}
              className="flex-shrink-0 w-[280px] md:w-[320px] group"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video overflow-hidden bg-[#111] border border-[#1a1a1a] card-scale">
                {post.mainImage?.asset?.url ? (
                  <Image
                    src={urlFor(post.mainImage).width(640).height(360).quality(80).url()}
                    alt={post.mainImage.alt || post.title}
                    fill
                    className="object-cover"
                    sizes="320px"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[#111]" />
                )}
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                  <p className="text-white text-sm font-medium line-clamp-2">{post.title}</p>
                </div>
                {/* Category Badge */}
                {post.categories?.[0] && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#00ff88] text-black text-[10px] font-bold font-mono">
                    {post.categories[0].title}
                  </span>
                )}
              </div>
              {/* Title */}
              <h3 className="mt-3 text-sm text-[#ccc] group-hover:text-[#00ff88] transition-colors line-clamp-2">
                {post.title}
              </h3>
              {post.author && (
                <p className="text-xs text-[#666] mt-1 font-mono">{post.author.name}</p>
              )}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export default async function HomePage() {
  // 1回のAPIコールで全データを取得（高速化）
  const data = await sanityFetch<HomePageData>({
    query: HOME_PAGE_QUERY,
    tags: ["post", "category"],
  });

  const { featured: featuredPosts, latest: latestPosts, categories } = data;
  const heroPost = featuredPosts?.[0];

  // デバッグ: 全フィールド確認
  console.log("=== 画像デバッグ ===");
  console.log("latest posts[0] 全データ:", JSON.stringify(latestPosts?.[0], null, 2));
  console.log("===================");

  return (
    <div className="bg-black min-h-screen grid-bg">
      {/* Hero Banner */}
      {heroPost && (
        <header className="relative h-[70vh] md:h-[75vh] mb-8" role="banner">
          {/* Background Image */}
          {heroPost.mainImage?.asset?.url && (
            <Image
              src={urlFor(heroPost.mainImage).width(1920).height(1080).quality(80).url()}
              alt={heroPost.mainImage.alt || heroPost.title}
              fill
              className="object-cover"
              priority
              sizes="100vw"
            />
          )}
          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
          
          {/* Content */}
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12">
            <div className="container">
              <div className="max-w-2xl">
                {heroPost.categories?.[0] && (
                  <span className="inline-block px-2 py-1 bg-[#00ff88] text-black text-xs font-bold font-mono mb-4">
                    {heroPost.categories[0].title}
                  </span>
                )}
                <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight mb-4">
                  {heroPost.title}
                </h1>
                {heroPost.excerpt && (
                  <p className="text-[#aaa] text-base md:text-lg mb-6 line-clamp-2">
                    {heroPost.excerpt}
                  </p>
                )}
                <nav className="flex items-center gap-4" aria-label="注目記事のリンク">
                  <Link
                    href={`/posts/${heroPost.slug}`}
                    className="px-6 py-3 bg-[#00ff88] text-black font-bold font-mono text-sm hover:bg-white transition-colors"
                  >
                    READ
                  </Link>
                  <Link
                    href="/posts"
                    className="px-6 py-3 border border-[#333] text-white font-mono text-sm hover:border-[#00ff88] hover:text-[#00ff88] transition-colors"
                  >
                    ALL ARTICLES
                  </Link>
                </nav>
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Content Rows */}
      <main className="pb-16" aria-label="記事一覧セクション">
        {/* Featured / 注目記事 */}
        {featuredPosts && featuredPosts.length > 1 && (
          <ArticleRow 
            title="FEATURED" 
            posts={featuredPosts.slice(1)} 
          />
        )}

        {/* Latest / 最新記事 */}
        <ArticleRow 
          title="LATEST" 
          posts={latestPosts || []} 
          href="/posts"
        />

        {/* Category Rows */}
        {categories.slice(0, 4).map((category) => (
          category.posts?.length > 0 && (
            <ArticleRow
              key={category.slug}
              title={category.title}
              posts={category.posts}
              href={`/categories/${category.slug}`}
            />
          )
        ))}

        {/* Categories Section */}
        <section className="mt-12">
          <div className="container">
            <h2 className="text-sm text-[#00ff88] font-mono tracking-wider uppercase mb-6">CATEGORIES</h2>
            <nav className="grid grid-cols-2 md:grid-cols-4 gap-4" aria-label="カテゴリー一覧">
              {categories.map((category, index) => (
                <Link
                  key={category.slug}
                  href={`/categories/${category.slug}`}
                  className="relative aspect-[4/3] overflow-hidden bg-black border border-[#00ff88]/30 group hover:border-[#00ff88] transition-all duration-300"
                >
                  {/* Background Grid Pattern */}
                  <div className="absolute inset-0 opacity-20 group-hover:opacity-40 transition-opacity"
                    style={{
                      backgroundImage: `linear-gradient(rgba(0,255,136,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.1) 1px, transparent 1px)`,
                      backgroundSize: '20px 20px'
                    }}
                  />
                  
                  {/* Glow Effect on Hover */}
                  <div className="absolute inset-0 bg-[#00ff88]/0 group-hover:bg-[#00ff88]/10 transition-colors duration-300" />
                  
                  {/* Corner Accents */}
                  <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#00ff88]" />
                  <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#00ff88]" />
                  <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#00ff88]" />
                  <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#00ff88]" />
                  
                  {/* Index Number */}
                  <span className="absolute top-3 left-3 text-[10px] text-[#00ff88]/50 font-mono">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  
                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                    <span className="text-white font-bold text-lg md:text-xl group-hover:text-[#00ff88] transition-colors text-center">
                      {category.title}
                    </span>
                    {category.postCount !== undefined && (
                      <span className="text-[#00ff88] text-xs font-mono mt-3 px-2 py-1 border border-[#00ff88]/30 group-hover:bg-[#00ff88] group-hover:text-black transition-all">
                        {category.postCount} POSTS
                      </span>
                    )}
                  </div>
                  
                  {/* Arrow Icon */}
                  <div className="absolute bottom-3 right-3 text-[#00ff88]/50 group-hover:text-[#00ff88] transition-colors">
                    <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              ))}
            </nav>
          </div>
        </section>
      </main>
    </div>
  );
}
