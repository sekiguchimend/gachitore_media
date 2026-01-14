import { Metadata } from "next";
import Link from "next/link";
import { sanityFetch } from "@/sanity/lib/fetch";
import { CATEGORIES_QUERY } from "@/sanity/lib/queries";
import type { Category } from "@/lib/types";
import { SITE_NAME, absoluteUrl, canonicalFrom } from "@/lib/seo";
import { jsonLdScript } from "@/lib/seo";

export const metadata: Metadata = {
  title: "カテゴリー一覧",
  description: "トレーニング・フィットネスに関する記事カテゴリー一覧です。",
  alternates: {
    canonical: canonicalFrom("/categories"),
  },
  openGraph: {
    type: "website",
    url: absoluteUrl("/categories"),
    title: `カテゴリー一覧 | ${SITE_NAME}`,
    description: "トレーニング・フィットネスに関する記事カテゴリー一覧です。",
    siteName: SITE_NAME,
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: `カテゴリー一覧 | ${SITE_NAME}`,
    description: "トレーニング・フィットネスに関する記事カテゴリー一覧です。",
  },
};

export const revalidate = 60;

export default async function CategoriesPage() {
  const categories = await sanityFetch<Category[]>({
    query: CATEGORIES_QUERY,
    tags: ["category"],
  });

  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: categories.map((c, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/categories/${c.slug}`),
      name: c.title,
    })),
  };

  return (
    <div className="bg-black min-h-screen pt-16 grid-bg">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(itemListJsonLd) }} />
      <main className="container py-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 pb-4 border-b border-[#1a1a1a]">
          <h1 className="text-sm text-[#00ff88] font-mono tracking-wider">CATEGORIES</h1>
          <p className="text-xs text-[#666] font-mono" aria-label="カテゴリー総数">
            {categories?.length || 0} TOTAL
          </p>
        </header>

        {/* Categories Grid */}
        <section aria-label="カテゴリー一覧">
          {categories && categories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category, index) => (
                <article key={category.slug}>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="group block p-6 border border-[#1a1a1a] hover:border-[#00ff88] transition-colors bg-[#0a0a0a]"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <span className="text-xs text-[#333] font-mono">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      {category.postCount !== undefined && category.postCount > 0 && (
                        <span className="text-xs text-[#00ff88] font-mono">
                          {category.postCount} POSTS
                        </span>
                      )}
                    </div>
                    <h2 className="text-xl font-bold text-white group-hover:text-[#00ff88] transition-colors mb-2">
                      {category.title}
                    </h2>
                    {category.description && (
                      <p className="text-xs text-[#666] line-clamp-2">{category.description}</p>
                    )}
                    <div className="mt-4 flex items-center gap-2 text-xs text-[#444] group-hover:text-[#00ff88] transition-colors font-mono">
                      <span>VIEW</span>
                      <svg className="w-3 h-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border border-[#1a1a1a]">
              <p className="text-[#666] text-sm font-mono">NO CATEGORIES YET</p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
