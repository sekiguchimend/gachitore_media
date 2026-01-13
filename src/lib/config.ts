// アプリプロモーション設定
export const APP_PROMO = {
  name: "ガチトレ",
  tagline: "筋トレ記録アプリ",
  description:
    "本格的な筋トレを記録・管理できる無料アプリ。トレーニングメニューの作成、セット数・重量の記録、進捗グラフで成長を可視化。",
  features: [
    "100種類以上のトレーニング",
    "進捗グラフで成長を確認",
    "完全無料で使える",
  ],
  links: {
    appStore: "https://apps.apple.com",
    googlePlay: "https://play.google.com",
  },
} as const;

export type AppPromoConfig = typeof APP_PROMO;
