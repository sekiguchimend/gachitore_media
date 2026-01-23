import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

// レート制限用のメモリストア（本番環境ではRedis等を推奨）
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

const RATE_LIMIT = {
  maxRequests: 3, // 最大リクエスト数
  windowMs: 60 * 60 * 1000, // 1時間
};

// レート制限チェック
function checkRateLimit(ip: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record || now > record.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT.windowMs });
    return { allowed: true, remaining: RATE_LIMIT.maxRequests - 1 };
  }

  if (record.count >= RATE_LIMIT.maxRequests) {
    return { allowed: false, remaining: 0 };
  }

  record.count++;
  return { allowed: true, remaining: RATE_LIMIT.maxRequests - record.count };
}

// 入力サニタイズ
function sanitizeInput(input: string, maxLength: number = 1000): string {
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/[<>]/g, ""); // 基本的なXSS対策
}

// メールアドレス検証
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// contact_type検証
const VALID_CONTACT_TYPES = ["account_deletion", "sales", "inquiry"] as const;
type ContactType = (typeof VALID_CONTACT_TYPES)[number];

function isValidContactType(type: string): type is ContactType {
  return VALID_CONTACT_TYPES.includes(type as ContactType);
}

type RequestBody = {
  email?: string;
  name?: string;
  subject?: string;
  message?: string;
  contact_type?: string;
};

export async function POST(req: Request) {
  // IPアドレス取得（プロキシ対応）
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "unknown";

  // レート制限チェック
  const rateLimit = checkRateLimit(ip);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "送信回数の上限に達しました。しばらく時間をおいてから再度お試しください。" },
      {
        status: 429,
        headers: {
          "Retry-After": "3600",
          "X-RateLimit-Remaining": "0",
        },
      }
    );
  }

  // リクエストボディのパース
  let body: RequestBody;
  try {
    body = (await req.json()) as RequestBody;
  } catch {
    return NextResponse.json({ error: "不正なリクエストです。" }, { status: 400 });
  }

  // 入力値の取得とサニタイズ
  const email = sanitizeInput(body.email || "", 254);
  const name = sanitizeInput(body.name || "", 100);
  const subject = sanitizeInput(body.subject || "", 200);
  const message = sanitizeInput(body.message || "", 5000);
  const contactType = (body.contact_type || "inquiry").trim();

  // バリデーション
  if (!email) {
    return NextResponse.json({ error: "メールアドレスを入力してください。" }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "メールアドレスの形式が正しくありません。" }, { status: 400 });
  }
  if (!message) {
    return NextResponse.json({ error: "お問い合わせ内容を入力してください。" }, { status: 400 });
  }
  if (message.length < 10) {
    return NextResponse.json({ error: "お問い合わせ内容は10文字以上で入力してください。" }, { status: 400 });
  }
  if (!isValidContactType(contactType)) {
    return NextResponse.json({ error: "お問い合わせ種別が不正です。" }, { status: 400 });
  }

  // ハニーポット検出（スパムボット対策）
  // フロントエンドで非表示のフィールドを追加し、それが埋められていたらボット判定
  const honeypot = (body as Record<string, unknown>)["website"] || "";
  if (honeypot) {
    // ボットと判定してもエラーは返さない（正常レスポンスを返す）
    return NextResponse.json({ ok: true }, { status: 200 });
  }

  try {
    const supabase = createSupabaseAdminClient();

    const { error } = await supabase.from("support_contacts").insert({
      email,
      name: name || null,
      subject: subject || getDefaultSubject(contactType),
      message,
      contact_type: contactType,
      platform: "web",
      device_info: {
        userAgent: req.headers.get("user-agent") || "unknown",
        ip: ip !== "unknown" ? ip.slice(0, 45) : null, // IPは一部のみ保存
      },
    });

    if (error) {
      console.error("Supabase insert error:", error);
      return NextResponse.json(
        { error: "送信に失敗しました。時間をおいて再度お試しください。" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { ok: true, message: "お問い合わせを受け付けました。" },
      {
        status: 201,
        headers: {
          "X-RateLimit-Remaining": String(rateLimit.remaining),
        },
      }
    );
  } catch (e) {
    const message = e instanceof Error ? e.message : "";
    const safeDetail = message.startsWith("Missing env:") ? message : undefined;
    console.error("Contact API error:", e);
    return NextResponse.json(
      {
        error: "サーバーエラーが発生しました。",
        detail: safeDetail,
      },
      { status: 500 }
    );
  }
}

function getDefaultSubject(contactType: ContactType): string {
  switch (contactType) {
    case "account_deletion":
      return "アカウント削除依頼";
    case "sales":
      return "営業・提携のご相談";
    case "inquiry":
    default:
      return "お問い合わせ";
  }
}
