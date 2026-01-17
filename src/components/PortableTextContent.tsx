import React from "react";
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
    normal: ({ children }) => {
      // childrenからテキストを抽出
      const extractText = (nodes: React.ReactNode): string => {
        let text = "";
        React.Children.forEach(nodes, (child) => {
          if (typeof child === "string") {
            text += child;
          } else if (React.isValidElement(child) && child.props.children) {
            text += extractText(child.props.children);
          }
        });
        return text;
      };

      const text = extractText(children);

      // 1行形式のマークダウンテーブルを検出（| header | | :--- | | data |）
      const isInlineTable = (str: string): boolean => {
        return str.includes("|") && 
               (str.includes("| :---") || str.includes("| ---") || str.includes("|:---") || str.includes("|---")) &&
               (str.match(/\|/g) || []).length >= 6;
      };

      // 1行形式のテーブルを複数行に変換
      const convertInlineTable = (str: string): string => {
        // | で区切られた部分を行に分割
        // パターン: | col | col | | :--- | :--- | | data | data |
        const parts = str.split(/\s*\|\s*/).filter(p => p.trim());
        
        // セパレータ行（:--- や ---）の位置を探す
        let separatorIndex = -1;
        for (let i = 0; i < parts.length; i++) {
          if (/^:?-+:?$/.test(parts[i].trim())) {
            separatorIndex = i;
            break;
          }
        }

        if (separatorIndex === -1) return str;

        // ヘッダーの列数を推測
        const colCount = separatorIndex;
        if (colCount === 0) return str;

        // 行を構築
        const rows: string[] = [];
        for (let i = 0; i < parts.length; i += colCount) {
          const rowParts = parts.slice(i, i + colCount);
          if (rowParts.length === colCount) {
            rows.push("| " + rowParts.join(" | ") + " |");
          }
        }

        return rows.join("\n");
      };

      // テーブルの場合はReactMarkdownでレンダリング
      if (isInlineTable(text)) {
        const tableMarkdown = convertInlineTable(text);
        return (
          <div className="my-8 overflow-x-auto rounded-lg border border-[#2a2a2a] shadow-lg shadow-black/20">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                table: ({ children }) => (
                  <table className="min-w-full">{children}</table>
                ),
                thead: ({ children }) => (
                  <thead className="bg-gradient-to-r from-[#00ff88] to-[#00cc6a] [&>tr]:bg-transparent">{children}</thead>
                ),
                tbody: ({ children }) => (
                  <tbody className="[&>tr:nth-child(even)]:bg-[#111] [&>tr:nth-child(odd)]:bg-[#0a0a0a] [&>tr:hover]:bg-[#1a1a1a]">{children}</tbody>
                ),
                th: ({ children }) => (
                  <th className="px-5 py-3.5 text-left text-sm font-bold text-black uppercase tracking-wider">{children}</th>
                ),
                td: ({ children }) => (
                  <td className="px-5 py-4 text-sm text-[#ccc] border-t border-[#2a2a2a]">{children}</td>
                ),
                tr: ({ children }) => (
                  <tr className="transition-colors">{children}</tr>
                ),
              }}
            >
              {tableMarkdown}
            </ReactMarkdown>
          </div>
        );
      }

      // childrenを処理してアスタリスクマークを太字に変換
      const processChildren = (nodes: React.ReactNode): React.ReactNode => {
        return React.Children.map(nodes, (child) => {
          if (typeof child === "string") {
            // **text** または *text* を太字に変換
            const parts = child.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
            return parts.map((part, index) => {
              if (part.startsWith("**") && part.endsWith("**")) {
                return <strong key={index} className="font-semibold text-[var(--text-primary)]">{part.slice(2, -2)}</strong>;
              }
              if (part.startsWith("*") && part.endsWith("*") && part.length > 2) {
                return <strong key={index} className="font-semibold text-[var(--text-primary)]">{part.slice(1, -1)}</strong>;
              }
              return part;
            });
          }
          return child;
        });
      };

      return (
        <p className="text-[var(--text-secondary)] leading-relaxed mb-5">
          {processChildren(children)}
        </p>
      );
    },
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
        <div className="my-8 overflow-x-auto rounded-lg border border-[#2a2a2a] shadow-lg shadow-black/20">
          <table className="min-w-full">
            {headerRow && (
              <thead>
                <tr className="bg-gradient-to-r from-[#00ff88] to-[#00cc6a]">
                  {headerRow.cells?.map((cell: string, cellIndex: number) => (
                    <th
                      key={cellIndex}
                      className="px-5 py-3.5 text-left text-sm font-bold text-black uppercase tracking-wider first:rounded-tl-lg last:rounded-tr-lg"
                    >
                      {cell}
                    </th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody className="divide-y divide-[#2a2a2a]">
              {bodyRows.map((row: { cells?: string[] }, rowIndex: number) => (
                <tr
                  key={rowIndex}
                  className={`${rowIndex % 2 === 0 ? "bg-[#0a0a0a]" : "bg-[#111]"} hover:bg-[#1a1a1a] transition-colors`}
                >
                  {row.cells?.map((cell: string, cellIndex: number) => (
                    <td
                      key={cellIndex}
                      className="px-5 py-4 text-sm text-[#ccc]"
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
                <div className="overflow-x-auto my-8 rounded-lg border border-[#2a2a2a] shadow-lg shadow-black/20">
                  <table className="min-w-full">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-gradient-to-r from-[#00ff88] to-[#00cc6a] [&>tr]:bg-transparent">{children}</thead>
              ),
              tbody: ({ children }) => (
                <tbody className="[&>tr:nth-child(even)]:bg-[#111] [&>tr:nth-child(odd)]:bg-[#0a0a0a] [&>tr:hover]:bg-[#1a1a1a]">{children}</tbody>
              ),
              th: ({ children }) => (
                <th className="px-5 py-3.5 text-left text-sm font-bold text-black uppercase tracking-wider first:rounded-tl-lg last:rounded-tr-lg">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-5 py-4 text-sm text-[#ccc] border-t border-[#2a2a2a]">
                  {children}
                </td>
              ),
              tr: ({ children }) => (
                <tr className="transition-colors">{children}</tr>
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

// ブロックからテキストを抽出するヘルパー関数
const getBlockText = (block: PortableTextBlock): string => {
  if (block._type !== "block" || !block.children) return "";
  return block.children
    .filter((child) => child._type === "span" && child.text)
    .map((child) => child.text || "")
    .join("");
};

// テーブル行かどうかを判定（|で始まり|で終わる、または|---|のようなセパレータ）
const isTableRow = (text: string): boolean => {
  const trimmed = text.trim();
  return /^\|.*\|$/.test(trimmed) || /^\|[\s\-:|]+\|$/.test(trimmed);
};

// マージされたテーブルブロックの型
type MergedTableBlock = {
  _type: "mergedTable";
  _key: string;
  content: string;
};

// 処理済みブロックの型
type ProcessedBlock = PortableTextBlock | MergedTableBlock;

// 型ガード関数
const isMergedTable = (block: ProcessedBlock): block is MergedTableBlock => {
  return block._type === "mergedTable";
};

// 連続するテーブル行を結合したvalueを生成
const preprocessBlocks = (blocks: PortableTextBlock[]): ProcessedBlock[] => {
  const result: ProcessedBlock[] = [];
  let i = 0;

  while (i < blocks.length) {
    const block = blocks[i];
    const blockText = getBlockText(block);

    // テーブル行の場合、連続するテーブル行をすべて収集
    if (block._type === "block" && isTableRow(blockText)) {
      const tableLines: string[] = [blockText];
      let j = i + 1;

      while (j < blocks.length) {
        const nextBlock = blocks[j];
        const nextText = getBlockText(nextBlock);
        if (nextBlock._type === "block" && isTableRow(nextText)) {
          tableLines.push(nextText);
          j++;
        } else {
          break;
        }
      }

      // 2行以上ある場合はテーブルとして結合
      if (tableLines.length >= 2) {
        result.push({
          _type: "mergedTable",
          _key: block._key + "_merged",
          content: tableLines.join("\n"),
        });
        i = j;
        continue;
      }
    }

    result.push(block);
    i++;
  }

  return result;
};

export function PortableTextContent({ value }: PortableTextContentProps) {
  if (!value || !Array.isArray(value)) return null;

  // 連続するテーブル行を前処理で結合
  const processedBlocks = preprocessBlocks(value);

  // カスタムレンダリング：mergedTableは特別に処理
  return (
    <div className="prose">
      {processedBlocks.map((block) => {
        if (isMergedTable(block)) {
          return (
            <div key={block._key} className="my-8 overflow-x-auto rounded-lg border border-[#2a2a2a] shadow-lg shadow-black/20">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  table: ({ children }) => (
                    <table className="min-w-full">
                      {children}
                    </table>
                  ),
                  thead: ({ children }) => (
                    <thead className="bg-gradient-to-r from-[#00ff88] to-[#00cc6a] [&>tr]:bg-transparent">{children}</thead>
                  ),
                  tbody: ({ children }) => (
                    <tbody className="[&>tr:nth-child(even)]:bg-[#111] [&>tr:nth-child(odd)]:bg-[#0a0a0a] [&>tr:hover]:bg-[#1a1a1a]">{children}</tbody>
                  ),
                  th: ({ children }) => (
                    <th className="px-5 py-3.5 text-left text-sm font-bold text-black uppercase tracking-wider first:rounded-tl-lg last:rounded-tr-lg">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="px-5 py-4 text-sm text-[#ccc] border-t border-[#2a2a2a]">
                      {children}
                    </td>
                  ),
                  tr: ({ children }) => (
                    <tr className="transition-colors">{children}</tr>
                  ),
                }}
              >
                {block.content}
              </ReactMarkdown>
            </div>
          );
        }

        // 通常のブロックはPortableTextでレンダリング
        return (
          <PortableText
            key={block._key}
            value={[block as PortableTextBlock]}
            components={components}
          />
        );
      })}
    </div>
  );
}

