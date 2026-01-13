import Image from "next/image";
import Link from "next/link";
import { urlFor } from "@/sanity/lib/image";
import { formatDateShort } from "@/lib/utils";
import type { Post } from "@/lib/types";

type Variant = "default" | "compact";

export function PostRow({
  post,
  variant = "default",
}: {
  post: Post;
  variant?: Variant;
}) {
  const hasImage = Boolean(post.mainImage?.asset?.url);
  const showExcerpt = variant === "default";

  return (
    <article className="group">
      <Link
        href={`/posts/${post.slug}`}
        className="block rounded-xl border border-transparent px-1 py-5 transition-colors hover:bg-[var(--bg-sub)]/60 focus-visible:bg-[var(--bg-sub)]/60"
      >
        <div className="flex items-start gap-4">
          {/* Thumbnail */}
          <div
            className={`relative shrink-0 overflow-hidden rounded-lg border border-[var(--border-default)] bg-[var(--bg-sub)] ${
              variant === "compact" ? "h-16 w-24" : "h-20 w-28 md:h-24 md:w-36"
            }`}
          >
            {hasImage ? (
              <Image
                src={urlFor(post.mainImage).width(640).height(420).url()}
                alt={post.mainImage?.alt || post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                sizes={variant === "compact" ? "96px" : "(max-width: 768px) 112px, 144px"}
                placeholder={post.mainImage?.asset?.metadata?.lqip ? "blur" : "empty"}
                blurDataURL={post.mainImage?.asset?.metadata?.lqip}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-xs text-[var(--text-tertiary)]">No image</span>
              </div>
            )}
          </div>

          {/* Body */}
          <div className="min-w-0 flex-1">
            {post.categories && post.categories.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-2">
                {post.categories.slice(0, 2).map((c) => (
                  <span
                    key={c.slug}
                    className="rounded-full border border-[var(--border-default)] bg-transparent px-2.5 py-1 text-xs text-[var(--text-tertiary)]"
                  >
                    {c.title}
                  </span>
                ))}
              </div>
            )}

            <h3
              className={`truncate font-semibold tracking-tight text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-primary)] ${
                variant === "compact" ? "text-base" : "text-lg md:text-xl"
              }`}
            >
              {post.title}
            </h3>

            {showExcerpt && post.excerpt && (
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                {post.excerpt}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-[var(--text-tertiary)]">
              {post.author?.name && (
                <>
                  <span className="text-[var(--text-secondary)]">{post.author.name}</span>
                  <span className="text-[var(--border-default)]">/</span>
                </>
              )}
              {post.publishedAt && <time>{formatDateShort(post.publishedAt)}</time>}
            </div>
          </div>

          {/* Arrow */}
          <div className="mt-1 hidden shrink-0 text-[var(--text-tertiary)] transition-colors group-hover:text-[var(--accent-primary)] md:block">
            <svg
              className="h-5 w-5"
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
      </Link>
    </article>
  );
}


