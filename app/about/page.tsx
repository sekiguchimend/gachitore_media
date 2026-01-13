import type { Metadata } from "next";
import { Breadcrumb } from "@/components";
import { DEFAULT_DESCRIPTION, SITE_NAME, absoluteUrl, canonicalFrom, jsonLdScript } from "@/lib/seo";

export const metadata: Metadata = {
  title: "このサイトについて（運営方針・Q&A）",
  description:
    "gachitore（ガチトレメディア）の運営方針、記事の作り方、免責事項、よくある質問（Q&A）をまとめています。",
  alternates: {
    canonical: canonicalFrom("/about"),
  },
  openGraph: {
    type: "article",
    url: absoluteUrl("/about"),
    title: "このサイトについて（運営方針・Q&A）",
    description:
      "gachitore（ガチトレメディア）の運営方針、記事の作り方、免責事項、よくある質問（Q&A）をまとめています。",
    siteName: SITE_NAME,
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "このサイトについて（運営方針・Q&A）",
    description:
      "gachitore（ガチトレメディア）の運営方針、記事の作り方、免責事項、よくある質問（Q&A）をまとめています。",
  },
};

export default function AboutPage() {
  const faq = [
    {
      q: "記事の内容は誰が書いていますか？",
      a: "筋トレ・栄養・コンディショニングの基礎知識をもとに編集し、読者が再現できる形で整理しています。医療行為に該当する判断は行いません。",
    },
    {
      q: "初心者は何から始めればいいですか？",
      a: "まずはBIG3を「軽い重量・正しいフォーム・継続」で始め、週2〜3回の全身トレと十分な睡眠・たんぱく質摂取を優先してください。",
    },
    {
      q: "サプリは必要ですか？",
      a: "食事が最優先です。補助としてプロテインやクレアチンなどの基本サプリを必要に応じて検討してください。",
    },
    {
      q: "掲載内容をそのまま実践して大丈夫？",
      a: "痛み・既往歴がある場合は医師や専門家へ。無理な重量や誤ったフォームはケガの原因になるため、段階的に負荷を上げてください。",
    },
    {
      q: "問い合わせ先は？",
      a: "現状は運用準備中です。公開後に本ページへ追記します。",
    },
  ] as const;

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "HOME",
        item: absoluteUrl("/"),
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "ABOUT",
        item: absoluteUrl("/about"),
      },
    ],
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: absoluteUrl("/"),
    description: DEFAULT_DESCRIPTION,
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: absoluteUrl("/"),
    description: DEFAULT_DESCRIPTION,
    inLanguage: "ja-JP",
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <div className="bg-black min-h-screen pt-16 grid-bg">
      {/* JSON-LD（表示には影響しない） */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(organizationJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(websiteJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLdScript(faqJsonLd) }} />

      <main className="container py-8">
        <nav aria-label="パンくずリスト">
          <Breadcrumb items={[{ label: "ABOUT" }]} />
        </nav>

        <header className="mb-10 pb-6 border-b border-[#1a1a1a]">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">このサイトについて</h1>
          <p className="text-sm text-[#888]">
            gachitore（ガチトレメディア）は、筋トレ・栄養・回復の「再現性」を重視して、初心者〜中級者が迷わず継続できる情報をまとめるメディアです。
          </p>
        </header>

        <div className="grid gap-10 lg:grid-cols-12">
          {/* Main */}
          <div className="lg:col-span-8">
            {/* 方針 */}
            <section id="policy" className="mb-10 scroll-mt-24">
              <h2 className="text-sm text-[#00ff88] font-mono tracking-wider uppercase mb-4">POLICY</h2>
              <div className="p-6 bg-[#0a0a0a] border border-[#1a1a1a]">
                <ul className="space-y-3 text-sm text-[#aaa]">
                  <li>
                    <span className="text-[#00ff88] font-mono text-xs">01</span>{" "}
                    フォーム・回数・休息・進捗管理など「実践可能な手順」に落とし込む
                  </li>
                  <li>
                    <span className="text-[#00ff88] font-mono text-xs">02</span>{" "}
                    目的別（筋肥大/ダイエット/健康）に、優先順位を明確にする
                  </li>
                  <li>
                    <span className="text-[#00ff88] font-mono text-xs">03</span>{" "}
                    危険なやり方を推奨しない（痛みがある場合の注意喚起を徹底）
                  </li>
                </ul>
              </div>
            </section>

            {/* テーブル（SEOと可読性の両方を意識） */}
            <section id="guide-table" className="mb-10 scroll-mt-24">
              <h2 className="text-sm text-[#00ff88] font-mono tracking-wider uppercase mb-4">GUIDE TABLE</h2>
              <div className="overflow-x-auto border border-[#1a1a1a] bg-[#0a0a0a]">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[#1a1a1a]">
                      <th className="text-left px-4 py-3 text-[#ccc] font-mono text-xs">項目</th>
                      <th className="text-left px-4 py-3 text-[#ccc] font-mono text-xs">推奨</th>
                      <th className="text-left px-4 py-3 text-[#ccc] font-mono text-xs">理由</th>
                    </tr>
                  </thead>
                  <tbody className="text-[#aaa]">
                    <tr className="border-b border-[#1a1a1a]">
                      <td className="px-4 py-3">頻度</td>
                      <td className="px-4 py-3">週2〜3回（全身）</td>
                      <td className="px-4 py-3">回復と習慣化のバランスが良い</td>
                    </tr>
                    <tr className="border-b border-[#1a1a1a]">
                      <td className="px-4 py-3">種目</td>
                      <td className="px-4 py-3">BIG3 + 補助種目</td>
                      <td className="px-4 py-3">全身を効率良く鍛えられる</td>
                    </tr>
                    <tr className="border-b border-[#1a1a1a]">
                      <td className="px-4 py-3">たんぱく質</td>
                      <td className="px-4 py-3">体重×1.6〜2.2g/日</td>
                      <td className="px-4 py-3">筋合成の材料を確保する</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-3">睡眠</td>
                      <td className="px-4 py-3">7時間以上</td>
                      <td className="px-4 py-3">回復・パフォーマンスに直結</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-[#555] font-mono mt-3">
                ※ 体調・年齢・既往歴により最適解は変わります。無理のない範囲で調整してください。
              </p>
            </section>

            {/* Q&A */}
            <section id="qa" className="mb-10 scroll-mt-24">
              <h2 className="text-sm text-[#00ff88] font-mono tracking-wider uppercase mb-4">Q&A</h2>
              <div className="space-y-4">
                {faq.map((item) => (
                  <details key={item.q} className="border border-[#1a1a1a] bg-[#0a0a0a] p-5">
                    <summary className="cursor-pointer text-[#ccc] font-semibold">
                      {item.q}
                    </summary>
                    <p className="mt-3 text-sm text-[#aaa] leading-relaxed">{item.a}</p>
                  </details>
                ))}
              </div>
            </section>

            {/* 免責 */}
            <section id="disclaimer" className="mb-4 scroll-mt-24">
              <h2 className="text-sm text-[#00ff88] font-mono tracking-wider uppercase mb-4">DISCLAIMER</h2>
              <div className="p-6 bg-[#0a0a0a] border border-[#1a1a1a]">
                <p className="text-sm text-[#aaa] leading-relaxed">
                  本サイトは一般的な情報提供を目的としており、医療・診断・治療の代替ではありません。痛みや疾患がある場合は専門家へご相談ください。
                </p>
              </div>
            </section>
          </div>

          {/* Side */}
          <aside className="lg:col-span-4" aria-label="補足情報">
            <div className="sticky top-24 space-y-4">
              <div className="p-6 bg-[#0a0a0a] border border-[#1a1a1a]">
                <h3 className="text-xs text-[#00ff88] font-mono tracking-wider uppercase mb-3">QUICK LINKS</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <a href="#policy" className="text-[#888] hover:text-[#00ff88] transition-colors">
                      運営方針
                    </a>
                  </li>
                  <li>
                    <a href="#guide-table" className="text-[#888] hover:text-[#00ff88] transition-colors">
                      ガイド表
                    </a>
                  </li>
                  <li>
                    <a href="#qa" className="text-[#888] hover:text-[#00ff88] transition-colors">
                      Q&A
                    </a>
                  </li>
                  <li>
                    <a href="#disclaimer" className="text-[#888] hover:text-[#00ff88] transition-colors">
                      免責事項
                    </a>
                  </li>
                </ul>
              </div>

              <div className="p-6 bg-[#0a0a0a] border border-[#1a1a1a]">
                <h3 className="text-xs text-[#00ff88] font-mono tracking-wider uppercase mb-3">SEO</h3>
                <p className="text-xs text-[#666] leading-relaxed">
                  本ページはFAQ構造化データ（FAQPage）とパンくず（BreadcrumbList）を実装しています。
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}


