"use client";

import { useEffect, useMemo, useState } from "react";

interface TocItem {
  _key: string;
  style: string;
  text: string;
}

interface TableOfContentsProps {
  body: Array<{
    _key: string;
    _type: string;
    style?: string;
    children?: Array<{ text: string }>;
  }>;
}

export function TableOfContents({ body }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  // 見出しを抽出
  const headings: TocItem[] = useMemo(() => {
    return body
      .filter((block) => block._type === "block" && (block.style === "h2" || block.style === "h3"))
      .map((block) => ({
        _key: block._key,
        style: block.style || "h2",
        text: block.children?.map((child) => child.text).join("") || "",
      }));
  }, [body]);

  useEffect(() => {
    if (headings.length < 2) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0px -80% 0px" }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading._key);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length < 2) return null;

  const scrollToHeading = (key: string) => {
    const element = document.getElementById(key);
    if (element) {
      const offset = 100;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <nav className="p-4 bg-[#0a0a0a] border border-[#1a1a1a] mb-8">
      <h2 className="text-xs text-[#00ff88] font-mono tracking-wider uppercase mb-4 flex items-center gap-2">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
        </svg>
        目次
      </h2>
      <ol className="space-y-2">
        {headings.map((heading, index) => (
          <li
            key={heading._key}
            className={heading.style === "h3" ? "ml-4" : ""}
          >
            <button
              onClick={() => scrollToHeading(heading._key)}
              className={`text-left text-sm transition-colors w-full flex items-start gap-2 ${
                activeId === heading._key
                  ? "text-[#00ff88]"
                  : "text-[#888] hover:text-[#ccc]"
              }`}
            >
              <span className="text-[10px] font-mono text-[#555] mt-0.5">
                {heading.style === "h2" ? `${index + 1}.` : "・"}
              </span>
              <span className="line-clamp-2">{heading.text}</span>
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}

