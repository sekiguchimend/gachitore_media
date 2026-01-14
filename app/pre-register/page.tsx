import type { Metadata } from "next";
import { PreRegisterForm } from "@/components/PreRegisterForm";
import { canonicalFrom } from "@/lib/seo";

export const metadata: Metadata = {
  title: "事前登録",
  description: "ガチトレの事前登録フォームです。メールアドレスとパスワードで登録できます。",
  alternates: {
    canonical: canonicalFrom("/pre-register"),
  },
  robots: { index: false, follow: true },
};

export default function PreRegisterPage() {
  return (
    <div className="bg-black min-h-screen pt-20 grid-bg">
      <main className="container py-10 flex justify-center">
        <PreRegisterForm />
      </main>
    </div>
  );
}


