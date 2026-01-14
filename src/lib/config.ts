// アプリプロモーション設定
export const APP_PROMO = {
  name: "ガチトレ",
  tagline: "本気のトレーニングアプリ",
  description:
    "AIに何でも質問できる筋トレ・食事記録アプリ。他のユーザーと交流しながら、みんなのトレーニング頻度や強度も参考にできる。",
  features: [
    "AIに筋トレ・食事の質問ができる",
    "トレーニングと食事を簡単記録",
    "他のユーザーと交流・情報共有",
    "みんなの頻度・強度を参考にできる",
  ],
  comingSoon: true,
  preRegisterUrl: "/pre-register",
} as const;

export type AppPromoConfig = typeof APP_PROMO;
