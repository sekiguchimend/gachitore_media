import { PortableText, type PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { urlFor } from "@/sanity/lib/image";
import type { PortableTextBlock } from "@/lib/types";

interface PortableTextContentProps {
  value: PortableTextBlock[];
}

// 見出しにIDを付与するためのコンポーネント
const createHeadingComponent = (
  Tag: "h2" | "h3" | "h4",
  className: string
) => {
  const HeadingComponent = ({ children, value }: { children?: React.ReactNode; value?: { _key?: string } }) => (
    <Tag id={value?._key} className={className}>
      {children}
    </Tag>
  );
  HeadingComponent.displayName = `Heading${Tag.toUpperCase()}`;
  return HeadingComponent;
};

const components: PortableTextComponents = {
  block: {
    h2: createHeadingComponent(
      "h2",
      "text-2xl font-bold text-[var(--text-primary)] mt-10 mb-4 pb-2 border-b border-[var(--border-default)] scroll-mt-24"
    ),
    h3: createHeadingComponent(
      "h3",
      "text-xl font-semibold text-[var(--text-primary)] mt-8 mb-3 scroll-mt-24"
    ),
    h4: createHeadingComponent(
      "h4",
      "text-lg font-semibold text-[var(--text-primary)] mt-6 mb-2 scroll-mt-24"
    ),
    normal: ({ children }) => (
      <p className="text-[var(--text-secondary)] leading-relaxed mb-5">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-[var(--accent-primary)] pl-4 my-6 text-[var(--text-tertiary)] italic">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-[var(--text-primary)]">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="bg-[var(--bg-elevated)] px-1.5 py-0.5 rounded text-sm font-mono text-[var(--accent-primary)]">
        {children}
      </code>
    ),
    link: ({ children, value }) => {
      const href = value?.href || "";
      const isExternal = href.startsWith("http");
      
      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] underline underline-offset-2 transition-colors"
          >
            {children}
          </a>
        );
      }
      
      return (
        <Link
          href={href}
          className="text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] underline underline-offset-2 transition-colors"
        >
          {children}
        </Link>
      );
    },
  },
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside my-4 space-y-2 text-[var(--text-secondary)] pl-4">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside my-4 space-y-2 text-[var(--text-secondary)] pl-4">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="pl-2">
        <span className="text-[var(--accent-primary)] mr-2">•</span>
        {children}
      </li>
    ),
    number: ({ children }) => <li className="pl-2">{children}</li>,
  },
  types: {
    image: ({ value }) => {
      if (!value?.asset) return null;

      return (
        <figure className="my-8">
          <div className="relative aspect-video rounded-lg overflow-hidden">
            <Image
              src={urlFor(value).width(1200).url()}
              alt={value.alt || ""}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 800px"
            />
          </div>
          {value.caption && (
            <figcaption className="text-center text-sm text-[var(--text-tertiary)] mt-3">
              {value.caption}
            </figcaption>
          )}
        </figure>
      );
    },
    table: ({ value }) => {
      if (!value?.rows || value.rows.length === 0) return null;

      const [headerRow, ...bodyRows] = value.rows;

      return (
        <div className="my-6 overflow-x-auto">
          <table className="min-w-full border-collapse border border-[var(--border-default)]">
            {headerRow && (
              <thead>
                <tr className="bg-[var(--bg-elevated)]">
                  {headerRow.cells?.map((cell: string, cellIndex: number) => (
                    <th
                      key={cellIndex}
                      className="border border-[var(--border-default)] px-4 py-2 text-left font-semibold text-[var(--text-primary)]"
                    >
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {bodyRows.map((row: { cells?: string[] }, rowIndex: number) => (
                <tr
                  key={rowIndex}
                  className={rowIndex % 2 === 0 ? "bg-[var(--bg-primary)]" : "bg-[var(--bg-secondary)]"}
                >
                  {row.cells?.map((cell: string, cellIndex: number) => (
                    <td
                      key={cellIndex}
                      className="border border-[var(--border-default)] px-4 py-2 text-[var(--text-secondary)]"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    },
    markdown: ({ value }) => {
      if (!value?.content) return null;

      return (
        <div className="my-6 markdown-content">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              table: ({ children }) => (
                <div className="overflow-x-auto my-4">
                  <table className="min-w-full border-collapse border border-[var(--border-default)]">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-[var(--bg-elevated)]">{children}</thead>
              ),
              th: ({ children }) => (
                <th className="border border-[var(--border-default)] px-4 py-2 text-left font-semibold text-[var(--text-primary)]">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="border border-[var(--border-default)] px-4 py-2 text-[var(--text-secondary)]">
                  {children}
                </td>
              ),
              tr: ({ children }) => (
                <tr className="even:bg-[var(--bg-secondary)]">{children}</tr>
              ),
              p: ({ children }) => (
                <p className="text-[var(--text-secondary)] leading-relaxed mb-4">{children}</p>
              ),
              a: ({ children, href }) => (
                <a
                  href={href}
                  className="text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] underline underline-offset-2 transition-colors"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {children}
                </a>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside my-4 space-y-2 text-[var(--text-secondary)] pl-4">
                  {children}
                </ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside my-4 space-y-2 text-[var(--text-secondary)] pl-4">
                  {children}
                </ol>
              ),
              li: ({ children }) => (
                <li className="pl-2">{children}</li>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-[var(--text-primary)]">{children}</strong>
              ),
              em: ({ children }) => <em className="italic">{children}</em>,
              code: ({ children }) => (
                <code className="bg-[var(--bg-elevated)] px-1.5 py-0.5 rounded text-sm font-mono text-[var(--accent-primary)]">
                  {children}
                </code>
              ),
            }}
          >
            {value.content}
          </ReactMarkdown>
        </div>
      );
    },
  },
};

export function PortableTextContent({ value }: PortableTextContentProps) {
  if (!value || !Array.isArray(value)) return null;
  
  return (
    <div className="prose">
      <PortableText value={value} components={components} />
    </div>
  );
}

