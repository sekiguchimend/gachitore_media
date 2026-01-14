import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { createSupabasePublicClient } from "@/lib/supabase/public";

type Body = {
  email?: string;
  password?: string;
};

function isValidEmail(email: string) {
  // 厳密にしすぎず、明らかな誤りを弾く程度
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ error: "不正なリクエストです。" }, { status: 400 });
  }

  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";

  if (!email || !password) {
    return NextResponse.json({ error: "メールアドレスとパスワードを入力してください。" }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "メールアドレスの形式が正しくありません。" }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "パスワードは8文字以上にしてください。" }, { status: 400 });
  }

  try {
    // service roleがあるなら admin 作成（メール確認もスキップ可能）
    try {
      const supabase = createSupabaseAdminClient();

      const { data, error } = await supabase.auth.admin.createUser({
        email,
        password,
        // 事前登録のUX重視：メール確認を待たずに登録完了扱いにする
        email_confirm: true,
      });

      if (error) {
        // 既に存在する場合も「登録済み」として扱う（列挙攻撃対策）
        const msg = String(error.message || "");
        if (msg.toLowerCase().includes("already") || msg.toLowerCase().includes("exists")) {
          return NextResponse.json({ ok: true }, { status: 200 });
        }
        return NextResponse.json({ error: "登録に失敗しました。時間をおいて再度お試しください。" }, { status: 500 });
      }

      return NextResponse.json({ ok: true, userId: data.user?.id }, { status: 201 });
    } catch (adminErr) {
      // service roleが無い場合は、public(anon/publishable)で通常の signUp にフォールバック
      const msg = adminErr instanceof Error ? adminErr.message : "";
      if (msg.startsWith("Missing env: SUPABASE_SERVICE_ROLE_KEY")) {
        const supabase = createSupabasePublicClient();
        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) {
          const emsg = String(error.message || "").toLowerCase();
          if (emsg.includes("already") || emsg.includes("registered") || emsg.includes("exists")) {
            return NextResponse.json({ ok: true }, { status: 200 });
          }
          return NextResponse.json({ error: "登録に失敗しました。時間をおいて再度お試しください。" }, { status: 500 });
        }

        return NextResponse.json({ ok: true, userId: data.user?.id }, { status: 201 });
      }

      throw adminErr;
    }
  } catch (e) {
    // どのenvが足りないかだけは返す（値は絶対に返さない）
    const message = e instanceof Error ? e.message : "";
    const safeDetail = message.startsWith("Missing env:") ? message : undefined;
    return NextResponse.json(
      {
        error: "サーバ設定エラーです。環境変数（Supabaseキー）を確認してください。",
        detail: safeDetail,
      },
      { status: 500 }
    );
  }
}


