import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { sanityFetch } from "@/sanity/lib/fetch";
import { POSTS_BY_CATEGORY_QUERY } from "@/sanity/lib/queries";
import { getCategoriesNav, getCategoryBySlug, getCategorySlugsForStaticParams } from "@/sanity/lib/data";
import { urlFor } from "@/sanity/lib/image";
import { Breadcrumb } from "@/components";
import type { Post, Category } from "@/lib/types";
import { SITE_NAME, absoluteUrl, canonicalFrom, jsonLdScript } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const categories = await getCategorySlugsForStaticParams();
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    return { title: "カテゴリーが見つかりません" };
  }

  return {
    title: `${category.title}の記事一覧`,
    description: category.description || `${category.title}に関する記事一覧`,
    robots: { index: true, follow: true },
    alternates: { canonical: canonicalFrom(`/categories/${slug}`) },
    openGraph: {
      type: "website",
      url: absoluteUrl(`/categories/${slug}`),
      title: `${category.title}の記事一覧 | ${SITE_NAME}`,
      description: category.description || `${category.title}に関する記事一覧`,
      siteName: SITE_NAME,
      locale: "ja_JP",
    },
    twitter: {
      card: "summary_large_image",
      title: `${category.title}の記事一覧 | ${SITE_NAME}`,
      description: category.description || `${category.title}に関する記事一覧`,
    },
  };
}

export const revalidate = 60;

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  
  const [category, posts, allCategories] = await Promise.all([
    getCategoryBySlug(slug),
    sanityFetch<Post[]>({
      query: POSTS_BY_CATEGORY_QUERY,
      params: { categorySlug: slug },
      tags: ["post", "category"],
    }),
    getCategoriesNav(),
  ]);

  if (!category) {
    notFound();
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "HOME", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "CATEGORIES", item: absoluteUrl("/categories") },
      { "@type": "ListItem", position: 3, name: category.title, item: absoluteUrl(`/categories/${slug}`) },
    ],
  };

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListOrder: "https://schema.org/ItemListOrderDescending",
    numberOfItems: posts.length,
    itemListElement: posts.map((p, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/posts/${p.slug}`),
    })),
  };

  return (
    <div className="bg-black min-h-screen pt-16 grid-bg">
      <main className="container py-8">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(itemListJsonLd) }} />
        {/* Breadcrumb */}
        <nav aria-label="パンくずリスト">
          <Breadcrumb
            items={[
              { label: "CATEGORIES", href: "/categories" },
              { label: category.title.toUpperCase() },
            ]}
          />
        </nav>

        {/* Header */}
        <header className="mb-8 pb-6 border-b border-[#1a1a1a]">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{category.title}</h1>
          {category.description && (
            <p className="text-sm text-[#888]">{category.description}</p>
          )}
          <p className="text-xs text-[#00ff88] font-mono mt-4" aria-label="記事数">
            {posts.length} ARTICLES
          </p>
        </header>

        {/* Categories Filter */}
        <nav className="flex flex-wrap gap-2 mb-8" aria-label="カテゴリーで絞り込み">
          <Link
            href="/posts"
            className="px-4 py-2 border border-[#333] text-[#888] text-xs font-mono font-bold hover:bg-[#00ff88] hover:text-black hover:border-[#00ff88] transition-colors"
          >
            ALL
          </Link>
          {allCategories.map((cat) => (
            <Link
              key={cat.slug}
              href={`/categories/${cat.slug}`}
              className={`px-4 py-2 text-xs font-mono font-bold transition-colors ${
                cat.slug === slug
                  ? "bg-[#00ff88] text-black"
                  : "border border-[#333] text-[#888] hover:bg-[#00ff88] hover:text-black hover:border-[#00ff88]"
              }`}
            >
              {cat.title.toUpperCase()}
            </Link>
          ))}
        </nav>

        {/* Posts Grid */}
        <section aria-label="カテゴリ内の記事一覧">
          {posts && posts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {posts.map((post) => (
                <article key={post._id}>
                  <Link href={`/posts/${post.slug}`} className="group block">
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
              <p className="text-[#666] text-sm font-mono">NO ARTICLES IN THIS CATEGORY</p>
            </div>
          )}
        </section>

        {/* Back Link */}
        <footer className="mt-12 pt-6 border-t border-[#1a1a1a]">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-xs text-[#666] hover:text-[#00ff88] transition-colors font-mono group"
          >
            <svg className="w-3 h-3 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            BACK TO CATEGORIES
          </Link>
        </footer>
      </main>
    </div>
  );
}
