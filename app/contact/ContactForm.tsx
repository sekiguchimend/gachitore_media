"use client";

import { useState, useCallback } from "react";
import { Send } from "lucide-react";

type ContactType = "inquiry" | "account_deletion" | "sales";

const CONTACT_TYPES: { value: ContactType; label: string }[] = [
  { value: "inquiry", label: "お問い合わせ" },
  { value: "account_deletion", label: "アカウント削除依頼" },
  { value: "sales", label: "営業・提携のご相談" },
];

type FormState = {
  status: "idle" | "submitting" | "success" | "error";
  message: string;
};

export function ContactForm() {
  const [formState, setFormState] = useState<FormState>({ status: "idle", message: "" });
  const [contactType, setContactType] = useState<ContactType>("inquiry");
  const [message, setMessage] = useState("");

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      // メッセージのバリデーション
      if (!message.trim()) {
        setFormState({ status: "error", message: "お問い合わせ内容を入力してください。" });
        return;
      }
      if (message.trim().length < 10) {
        setFormState({ status: "error", message: "お問い合わせ内容は10文字以上で入力してください。" });
        return;
      }

      setFormState({ status: "submitting", message: "" });

      const form = e.currentTarget;
      const formData = new FormData(form);

      const data = {
        email: formData.get("email") as string,
        name: formData.get("name") as string,
        subject: formData.get("subject") as string,
        message: message,
        contact_type: contactType,
        website: formData.get("website") as string,
      };

      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });

        const json = await res.json();

        if (!res.ok) {
          setFormState({
            status: "error",
            message: json.error || "送信に失敗しました。",
          });
          return;
        }

        setFormState({
          status: "success",
          message: "お問い合わせを受け付けました。ご返信まで今しばらくお待ちください。",
        });
        form.reset();
        setMessage("");
        setContactType("inquiry");
      } catch {
        setFormState({
          status: "error",
          message: "ネットワークエラーが発生しました。接続を確認して再度お試しください。",
        });
      }
    },
    [contactType, message]
  );

  const isSubmitting = formState.status === "submitting";

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* お問い合わせ種別 */}
      <div>
        <label className="block text-xs text-[#00ff88] font-mono tracking-wider uppercase mb-2">
          お問い合わせ種別 <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {CONTACT_TYPES.map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setContactType(type.value)}
              className={`px-3 py-1.5 text-xs border transition-colors rounded-[5px] ${
                contactType === type.value
                  ? "border-[#00ff88] bg-[#00ff88]/10 text-[#00ff88]"
                  : "border-[#333] bg-[#0a0a0a] text-[#888] hover:border-[#555] hover:text-[#ccc]"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* メールアドレス */}
      <div>
        <label htmlFor="email" className="block text-xs text-[#00ff88] font-mono tracking-wider uppercase mb-2">
          メールアドレス <span className="text-red-500">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          autoComplete="email"
          placeholder="example@email.com"
          className="w-full px-3 py-2.5 bg-[#0a0a0a] border border-[#333] text-white text-sm placeholder-[#555] focus:border-[#00ff88] focus:outline-none transition-colors rounded-[5px]"
          disabled={isSubmitting}
        />
      </div>

      {/* お名前（任意） */}
      <div>
        <label htmlFor="name" className="block text-xs text-[#00ff88] font-mono tracking-wider uppercase mb-2">
          お名前 <span className="text-[#555]">(任意)</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          autoComplete="name"
          placeholder="山田 太郎"
          className="w-full px-3 py-2.5 bg-[#0a0a0a] border border-[#333] text-white text-sm placeholder-[#555] focus:border-[#00ff88] focus:outline-none transition-colors rounded-[5px]"
          disabled={isSubmitting}
        />
      </div>

      {/* 件名（任意） */}
      <div>
        <label htmlFor="subject" className="block text-xs text-[#00ff88] font-mono tracking-wider uppercase mb-2">
          件名 <span className="text-[#555]">(任意)</span>
        </label>
        <input
          type="text"
          id="subject"
          name="subject"
          placeholder="お問い合わせの件名"
          className="w-full px-3 py-2.5 bg-[#0a0a0a] border border-[#333] text-white text-sm placeholder-[#555] focus:border-[#00ff88] focus:outline-none transition-colors rounded-[5px]"
          disabled={isSubmitting}
        />
      </div>

      {/* お問い合わせ内容 */}
      <div>
        <label htmlFor="message" className="block text-xs text-[#00ff88] font-mono tracking-wider uppercase mb-2">
          お問い合わせ内容 <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          minLength={10}
          placeholder={getPlaceholder(contactType)}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-3 py-2.5 bg-[#0a0a0a] border border-[#333] text-white text-sm placeholder-[#555] focus:border-[#00ff88] focus:outline-none resize-none rounded-[5px] transition-colors"
          disabled={isSubmitting}
        />
        <p className="text-xs text-[#555] mt-1">※ 10文字以上でご入力ください</p>
      </div>

      {/* 送信ボタン */}
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full flex items-center justify-center gap-2 px-6 py-3 rounded-[5px] text-sm font-medium transition-all ${
          isSubmitting
            ? "bg-[#333] text-[#666] cursor-not-allowed"
            : "bg-[#00ff88] text-black hover:bg-[#00cc6a] active:scale-[0.98]"
        }`}
      >
        {isSubmitting ? (
          <>
            <LoadingSpinner />
            送信中...
          </>
        ) : (
          <>
            <Send className="w-4 h-4" />
            送信する
          </>
        )}
      </button>

      {/* ハニーポット（スパム対策・非表示） */}
      <div className="hidden" aria-hidden="true">
        <label htmlFor="website">Website</label>
        <input
          type="text"
          id="website"
          name="website"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      {/* ステータスメッセージ */}
      {formState.status === "success" && (
        <div className="p-3 bg-[#00ff88]/10 border border-[#00ff88] text-[#00ff88] text-sm rounded-[5px]">
          {formState.message}
        </div>
      )}
      {formState.status === "error" && (
        <div className="p-3 bg-red-500/10 border border-red-500 text-red-400 text-sm rounded-[5px]">
          {formState.message}
        </div>
      )}

      {/* プライバシーポリシー */}
      <p className="text-xs text-[#555] text-center">
        送信いただいた情報は、お問い合わせへの対応目的にのみ使用いたします。
      </p>
    </form>
  );
}

function getPlaceholder(contactType: ContactType): string {
  switch (contactType) {
    case "account_deletion":
      return "アカウント削除をご希望の理由や、登録時のメールアドレスなどをご記入ください。";
    case "sales":
      return "御社名、ご担当者名、ご相談内容などをご記入ください。";
    case "inquiry":
    default:
      return "お問い合わせ内容をご記入ください。";
  }
}

function LoadingSpinner() {
  return (
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );
}
