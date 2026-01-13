import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getPostBySlug, getRecentPostSlugsForStaticParams } from "@/sanity/lib/data";
import { urlFor } from "@/sanity/lib/image";
import { formatDate } from "@/lib/utils";
import {
  PortableTextContent,
  Breadcrumb,
  TableOfContents,
  ShareButtons,
  RelatedPosts,
  AppPromoCard,
} from "@/components";
import type { Post } from "@/lib/types";
import { SITE_NAME, absoluteUrl, canonicalFrom, jsonLdScript } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const limit = Math.max(0, Number(process.env.SANITY_STATIC_PARAMS_LIMIT || "200"));
  if (!Number.isFinite(limit) || limit === 0) return [];

  const posts = await getRecentPostSlugsForStaticParams(limit);
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "記事が見つかりません" };
  }

  const description = post.excerpt || `${post.title}に関する記事`;

  return {
    title: post.title,
    description,
    alternates: { canonical: canonicalFrom(`/posts/${slug}`) },
    openGraph: {
      title: post.title,
      description,
      type: "article",
      url: absoluteUrl(`/posts/${slug}`),
      siteName: SITE_NAME,
      locale: "ja_JP",
      publishedTime: post.publishedAt,
      images: post.mainImage?.asset?.url
        ? [{ url: urlFor(post.mainImage).width(1200).height(630).url() }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: post.mainImage?.asset?.url
        ? [urlFor(post.mainImage).width(1200).height(630).url()]
        : [],
    },
  };
}

export const revalidate = 60;

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const shareUrl = absoluteUrl(`/posts/${slug}`);

  const breadcrumbItems = [
    { label: "ARTICLES", href: "/posts" },
    ...(post.categories?.[0]
      ? [{ label: post.categories[0].title.toUpperCase(), href: `/categories/${post.categories[0].slug}` }]
      : []),
    { label: post.title.length > 30 ? post.title.slice(0, 30) + "..." : post.title },
  ];

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "HOME", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "ARTICLES", item: absoluteUrl("/posts") },
      ...(post.categories?.[0]
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: post.categories[0].title,
              item: absoluteUrl(`/categories/${post.categories[0].slug}`),
            },
            {
              "@type": "ListItem",
              position: 4,
              name: post.title,
              item: absoluteUrl(`/posts/${slug}`),
            },
          ]
        : [
            {
              "@type": "ListItem",
              position: 3,
              name: post.title,
              item: absoluteUrl(`/posts/${slug}`),
            },
          ]),
    ],
  };

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt || undefined,
    mainEntityOfPage: absoluteUrl(`/posts/${slug}`),
    datePublished: post.publishedAt || undefined,
    dateModified: post._updatedAt || undefined,
    author: post.author?.name ? [{ "@type": "Person", name: post.author.name }] : undefined,
    publisher: { "@type": "Organization", name: SITE_NAME, url: absoluteUrl("/") },
    image: post.mainImage?.asset?.url
      ? [urlFor(post.mainImage).width(1200).height(630).url()]
      : undefined,
    inLanguage: "ja-JP",
  };

  return (
    <article className="min-h-screen bg-black">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(articleJsonLd) }} />
      {/* Hero Image - Full Width */}
      {post.mainImage?.asset?.url && (
        <div className="relative w-full h-[50vh] md:h-[60vh]">
          <Image
            src={urlFor(post.mainImage).width(1920).height(1080).quality(80).url()}
            alt={post.mainImage.alt || post.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
          <div className="absolute inset-0 border-b border-[#00ff88]/20" />
        </div>
      )}

      <div className="container">
        {/* Breadcrumb */}
        <div className={post.mainImage?.asset?.url ? "pt-4" : "pt-20"}>
          <nav aria-label="パンくずリスト">
            <Breadcrumb items={breadcrumbItems} />
          </nav>
        </div>

        {/* Header */}
        <header className={`relative ${post.mainImage?.asset?.url ? "-mt-28 md:-mt-36" : ""} mb-8`}>
          <div className="max-w-3xl">
            {/* Category */}
            {post.categories?.[0] && (
              <Link
                href={`/categories/${post.categories[0].slug}`}
                className="inline-block px-2 py-1 bg-[#00ff88] text-black text-xs font-bold font-mono mb-4 hover:bg-white transition-colors"
              >
                {post.categories[0].title.toUpperCase()}
              </Link>
            )}

            {/* Title */}
            <h1 className="text-2xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
              {post.title}
            </h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-6">
              {post.author && (
                <div className="flex items-center gap-3">
                  {post.author.image?.asset?.url ? (
                    <Image
                      src={urlFor(post.author.image).width(80).height(80).url()}
                      alt={post.author.name}
                      width={36}
                      height={36}
                      className="rounded-full"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-[#1a1a1a]" />
                  )}
                  <span className="text-[#ccc]">{post.author.name}</span>
                </div>
              )}
              {post.publishedAt && (
                <time className="text-[#666] text-sm font-mono">{formatDate(post.publishedAt)}</time>
              )}
            </div>

            {/* Share Buttons */}
            <nav aria-label="SNSシェア">
              <ShareButtons url={shareUrl} title={post.title} />
            </nav>
          </div>
        </header>

        {/* Divider */}
        <div className="max-w-3xl h-px bg-[#1a1a1a] mb-8" />

        {/* Excerpt */}
        {post.excerpt && (
          <div className="max-w-3xl mb-8">
            <p className="text-lg md:text-xl text-[#aaa] leading-relaxed">
              {post.excerpt}
            </p>
          </div>
        )}

        {/* Two Column Layout */}
        <div className="flex gap-8 lg:gap-12">
          {/* Main Content */}
          <div className="flex-1 min-w-0 max-w-3xl">
            {/* Table of Contents */}
            {post.body && (
              <nav aria-label="目次">
                <TableOfContents body={post.body} />
              </nav>
            )}

            {/* Body */}
            {post.body && (
              <section className="pb-12" aria-label="本文">
                <PortableTextContent value={post.body} />
              </section>
            )}

            {/* Share Buttons (Bottom) */}
            <footer className="py-8 border-t border-[#1a1a1a]">
              <p className="text-xs text-[#666] font-mono mb-4">この記事をシェア</p>
              <nav aria-label="SNSシェア（記事末尾）">
                <ShareButtons url={shareUrl} title={post.title} />
              </nav>
            </footer>

            {/* Author Bio */}
            {post.author?.bio && (
              <div className="py-8 border-t border-[#1a1a1a]">
                <div className="flex items-start gap-4 p-6 bg-[#0a0a0a] border border-[#1a1a1a]">
                  {post.author.image?.asset?.url ? (
                    <Image
                      src={urlFor(post.author.image).width(120).height(120).url()}
                      alt={post.author.name}
                      width={56}
                      height={56}
                      className="rounded-full flex-shrink-0"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-full bg-[#1a1a1a] flex-shrink-0" />
                  )}
                  <div>
                    <p className="text-[10px] text-[#666] font-mono mb-1">AUTHOR</p>
                    <h3 className="text-lg font-semibold text-white mb-2">{post.author.name}</h3>
                    <p className="text-sm text-[#888] leading-relaxed">{post.author.bio}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Related Posts */}
            {post.relatedPosts && post.relatedPosts.length > 0 && (
              <section aria-label="関連記事">
                <RelatedPosts posts={post.relatedPosts} currentPostId={post._id} />
              </section>
            )}

            {/* App Promo Card - Mobile */}
            <div className="lg:hidden py-8 border-t border-[#1a1a1a]">
              <AppPromoCard />
            </div>

            {/* Back Link */}
            <footer className="py-8 border-t border-[#1a1a1a]">
              <Link
                href="/posts"
                className="inline-flex items-center gap-2 px-6 py-3 border border-[#1a1a1a] text-[#888] hover:border-[#00ff88] hover:text-[#00ff88] transition-colors font-mono text-xs"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                </svg>
                BACK TO ARTICLES
              </Link>
            </footer>
          </div>

          {/* Sidebar - Desktop */}
          <div className="hidden lg:block w-72 flex-shrink-0">
            <div className="sticky top-24">
              <AppPromoCard />
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
