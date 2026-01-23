import type { Metadata } from "next";
import { Breadcrumb } from "@/components";
import { SITE_NAME, absoluteUrl, canonicalFrom, jsonLdScript } from "@/lib/seo";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "お問い合わせ",
  description:
    "gachitore（ガチトレメディア）へのお問い合わせページです。ご質問、アカウント削除依頼、営業のご相談などお気軽にご連絡ください。",
  alternates: {
    canonical: canonicalFrom("/contact"),
  },
  openGraph: {
    type: "website",
    url: absoluteUrl("/contact"),
    title: "お問い合わせ | " + SITE_NAME,
    description:
      "gachitore（ガチトレメディア）へのお問い合わせページです。ご質問、アカウント削除依頼、営業のご相談などお気軽にご連絡ください。",
    siteName: SITE_NAME,
    locale: "ja_JP",
  },
  twitter: {
    card: "summary",
    title: "お問い合わせ | " + SITE_NAME,
    description:
      "gachitore（ガチトレメディア）へのお問い合わせページです。ご質問、アカウント削除依頼、営業のご相談などお気軽にご連絡ください。",
  },
};

export default function ContactPage() {
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
        name: "CONTACT",
        item: absoluteUrl("/contact"),
      },
    ],
  };

  return (
    <div className="bg-black min-h-screen pt-16 grid-bg">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLdScript(breadcrumbJsonLd) }}
      />

      <main className="container py-8">
        <nav aria-label="パンくずリスト">
          <Breadcrumb items={[{ label: "CONTACT" }]} />
        </nav>

        <header className="mb-10 pb-6 border-b border-[#1a1a1a]">
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">お問い合わせ</h1>
          <p className="text-sm text-[#888]">
            ご質問、アカウント削除依頼、営業のご相談など、下記フォームよりお問い合わせください。
          </p>
        </header>

        <div className="max-w-lg mx-auto">
          <ContactForm />
        </div>
      </main>
    </div>
  );
}
