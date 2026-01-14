import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getCategoriesNav, getPostsPage } from "@/sanity/lib/data";
import { urlFor } from "@/sanity/lib/image";
import { Breadcrumb, Pagination } from "@/components";
import type { Post, Category } from "@/lib/types";
import { SITE_NAME, absoluteUrl, canonicalFrom, jsonLdScript } from "@/lib/seo";

export const revalidate = 60;

const POSTS_PER_PAGE = 12;

interface PostsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({ searchParams }: PostsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || "1", 10));
  const title = currentPage > 1 ? `記事一覧（${currentPage}ページ目）` : "記事一覧";
  const description = "トレーニング・フィットネスに関する記事一覧";
  const search = currentPage > 1 ? `page=${currentPage}` : "";

  return {
    title,
    description,
    alternates: { canonical: canonicalFrom("/posts", search) },
    openGraph: {
      type: "website",
      url: absoluteUrl(`/posts${search ? `?${search}` : ""}`),
      title: `${title} | ${SITE_NAME}`,
      description,
      siteName: SITE_NAME,
      locale: "ja_JP",
    },
    twitter: { card: "summary_large_image", title: `${title} | ${SITE_NAME}`, description },
  };
}

export default async function PostsPage({ searchParams }: PostsPageProps) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || "1", 10));
  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;

  const [postsData, categories] = await Promise.all([getPostsPage({ start, end }), getCategoriesNav()]);

  const { posts, total } = postsData;
  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "HOME", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "ARTICLES", item: absoluteUrl("/posts") },
    ],
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    numberOfItems: posts.length,
    itemListElement: posts.map((p, index) => ({
      "@type": "ListItem",
      position: start + index + 1,
      url: absoluteUrl(`/posts/${p.slug}`),
    })),
  };

  return (
    <div className="bg-black min-h-screen pt-16 grid-bg">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(itemListJsonLd) }} />
      <main className="container py-8">
        {/* Breadcrumb */}
        <nav aria-label="パンくずリスト">
          <Breadcrumb items={[{ label: "ARTICLES" }]} />
        </nav>

        {/* Header */}
        <header className="flex items-center justify-between mb-8 pb-4 border-b border-[#1a1a1a]">
          <h1 className="text-sm text-[#00ff88] font-mono tracking-wider">ALL ARTICLES</h1>
          <p className="text-xs text-[#666] font-mono" aria-label="総記事数">
            {total} POSTS
          </p>
        </header>

        {/* Categories Filter */}
        {categories && categories.length > 0 && (
          <nav className="flex flex-wrap gap-2 mb-8" aria-label="カテゴリーで絞り込み">
            <span className="px-4 py-2 border border-[#00ff88] text-[#00ff88] text-xs font-mono">
              ALL
            </span>
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/categories/${category.slug}`}
                className="px-4 py-2 bg-[#00ff88] text-black text-xs font-mono font-bold hover:bg-white transition-colors"
              >
                {category.title.toUpperCase()}
              </Link>
            ))}
          </nav>
        )}

        {/* Posts Grid */}
        <section aria-label="記事一覧">
          {posts && posts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {posts.map((post) => (
                <article key={post._id}>
                  <Link href={`/posts/${post.slug}`} className="group">
                    {/* Thumbnail */}
                    <div className="relative aspect-video overflow-hidden bg-[#111] border border-[#1a1a1a] card-scale">
                      {post.mainImage?.asset?.url ? (
                        <Image
                          src={urlFor(post.mainImage).width(480).height(270).quality(80).url()}
                          alt={post.mainImage.alt || post.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[#111]" />
                      )}
                      {/* Category Badge */}
                      {post.categories?.[0] && (
                        <span className="absolute top-2 left-2 px-2 py-0.5 bg-[#00ff88] text-black text-[10px] font-bold font-mono">
                          {post.categories[0].title}
                        </span>
                      )}
                    </div>
                    {/* Info */}
                    <div className="mt-3">
                      <h2 className="text-sm text-[#ccc] group-hover:text-[#00ff88] transition-colors line-clamp-2">
                        {post.title}
                      </h2>
                      {post.author && (
                        <p className="text-xs text-[#666] mt-1 font-mono">{post.author.name}</p>
                      )}
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border border-[#1a1a1a]">
              <p className="text-[#666] text-sm font-mono">NO ARTICLES YET</p>
            </div>
          )}
        </section>

        {/* Pagination */}
        <nav aria-label="ページネーション">
          <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/posts" />
        </nav>
      </main>
    </div>
  );
}
