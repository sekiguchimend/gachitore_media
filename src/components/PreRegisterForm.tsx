"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

export function PreRegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/pre-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error || "登録に失敗しました。");
        return;
      }

      setStatus("success");
      setMessage("事前登録が完了しました。リリース時にお知らせします。");
      setPassword("");
    } catch {
      setStatus("error");
      setMessage("通信エラーです。時間をおいて再度お試しください。");
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-md border border-[#1a1a1a] bg-[#0a0a0a] p-6">
      <h1 className="text-lg font-bold text-white mb-2">事前登録</h1>
      <p className="text-xs text-[#666] mb-6">メールアドレスとパスワードを入力してください。</p>

      <div className="space-y-4">
        <label className="block">
          <span className="text-[10px] text-[#00ff88] font-mono tracking-wider">EMAIL</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-2 w-full rounded border border-[#1a1a1a] bg-black px-3 py-2 text-sm text-white outline-none focus:border-[#00ff88]"
            placeholder="you@example.com"
          />
        </label>

        <label className="block">
          <span className="text-[10px] text-[#00ff88] font-mono tracking-wider">PASSWORD</span>
          <input
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-2 w-full rounded border border-[#1a1a1a] bg-black px-3 py-2 text-sm text-white outline-none focus:border-[#00ff88]"
            placeholder="8文字以上"
          />
        </label>

        {message && (
          <p className={`text-xs ${status === "success" ? "text-[#00ff88]" : "text-[#ff4d4d]"}`}>{message}</p>
        )}

        <button
          type="submit"
          disabled={status === "loading"}
          className="w-full py-3 bg-[#00ff88] text-black font-bold text-xs rounded hover:bg-[#00cc6a] transition-colors disabled:opacity-60"
        >
          {status === "loading" ? "送信中..." : "事前登録する"}
        </button>
      </div>

      <p className="text-[10px] text-[#555] mt-4 leading-relaxed">
        ※ 本機能はテスト運用中です。登録済みの場合も「完了」と表示されることがあります。
      </p>
    </form>
  );
}


