import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import type { Post } from "@/lib/types";

interface RelatedPostsProps {
  posts: Post[];
  currentPostId: string;
}

export function RelatedPosts({ posts, currentPostId }: RelatedPostsProps) {
  // 現在の記事を除外して2件表示
  const filteredPosts = posts.filter((post) => post._id !== currentPostId).slice(0, 2);

  if (filteredPosts.length === 0) return null;

  return (
    <section className="py-12 border-t border-[#1a1a1a]">
      <h2 className="text-sm text-[#00ff88] font-mono tracking-wider uppercase mb-6">
        RECOMMENDED ARTICLES
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {filteredPosts.map((post) => (
          <Link
            key={post._id}
            href={`/posts/${post.slug}`}
            className="group flex gap-4 p-4 bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#00ff88]/50 transition-colors"
          >
            {/* Thumbnail */}
            <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden bg-[#111]">
              {post.mainImage?.asset?.url ? (
                <Image
                  src={urlFor(post.mainImage).width(200).height(200).quality(80).url()}
                  alt={post.mainImage.alt || post.title}
                  fill
                  className="object-cover"
                  sizes="96px"
                />
              ) : (
                <div className="absolute inset-0 bg-[#111]" />
              )}
            </div>
            {/* Content */}
            <div className="flex-1 min-w-0">
              {post.categories?.[0] && (
                <span className="text-[10px] text-[#00ff88] font-mono">
                  {post.categories[0].title}
                </span>
              )}
              <h3 className="text-sm text-[#ccc] group-hover:text-[#00ff88] transition-colors line-clamp-2 mt-1">
                {post.title}
              </h3>
              {post.publishedAt && (
                <time className="text-[10px] text-[#555] font-mono mt-2 block">
                  {new Date(post.publishedAt).toLocaleDateString("ja-JP")}
                </time>
              )}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

