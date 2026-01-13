import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { formatDateShort } from "@/lib/utils";
import type { Post } from "@/lib/types";

export function FeaturedPostHero({ post }: { post: Post }) {
  const hasImage = Boolean(post.mainImage?.asset?.url);

  return (
    <section className="overflow-hidden rounded-2xl border border-[var(--border-default)] bg-[var(--bg-main)]">
      <Link href={`/posts/${post.slug}`} className="block">
        <div className="grid gap-0 md:grid-cols-12">
          <div className="relative md:col-span-7">
            <div className="relative aspect-[16/10] md:aspect-auto md:min-h-[420px]">
              {hasImage ? (
                <Image
                  src={urlFor(post.mainImage).width(1600).height(1000).url()}
                  alt={post.mainImage?.alt || post.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 60vw"
                  placeholder={post.mainImage?.asset?.metadata?.lqip ? "blur" : "empty"}
                  blurDataURL={post.mainImage?.asset?.metadata?.lqip}
                />
              ) : (
                <div className="absolute inset-0 bg-[var(--bg-sub)]" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="h-full border-t border-[var(--border-default)] bg-[var(--bg-main)] p-6 md:border-t-0 md:border-l md:p-8">
              <div className="flex flex-wrap gap-2">
                {post.categories?.slice(0, 2).map((c) => (
                  <span
                    key={c.slug}
                    className="rounded-full border border-[var(--border-default)] px-2.5 py-1 text-xs text-[var(--text-tertiary)]"
                  >
                    {c.title}
                  </span>
                ))}
                {post.featured && (
                  <span className="rounded-full bg-[var(--accent-primary)] px-2.5 py-1 text-xs font-semibold text-[var(--bg-main)]">
                    注目
                  </span>
                )}
              </div>

              <h2 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-[var(--text-primary)] md:text-3xl">
                {post.title}
              </h2>

              {post.excerpt && (
                <p className="mt-4 text-[var(--text-secondary)] leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              <div className="mt-6 flex flex-wrap items-center gap-2 text-sm text-[var(--text-tertiary)]">
                {post.author?.name && (
                  <>
                    <span className="text-[var(--text-secondary)]">{post.author.name}</span>
                    <span className="text-[var(--border-default)]">/</span>
                  </>
                )}
                {post.publishedAt && <time>{formatDateShort(post.publishedAt)}</time>}
              </div>

              <div className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-primary)]">
                記事を読む
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </section>
  );
}


