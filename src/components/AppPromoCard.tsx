"use client";

import Image from "next/image";
import { APP_PROMO, type AppPromoConfig } from "@/lib/config";
import { useRouter } from "next/navigation";

type Props = {
  config?: AppPromoConfig;
};

const CheckIcon = () => (
  <svg
    className="w-3 h-3 text-[#00ff88] flex-shrink-0"
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path
      fillRule="evenodd"
      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      clipRule="evenodd"
    />
  </svg>
);

const BellIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
    />
  </svg>
);

export function AppPromoCard({ config = APP_PROMO }: Props) {
  const router = useRouter();
  const { name, tagline, description, features } = config;

  return (
    <aside className="w-full">
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00ff88]/20 to-transparent px-4 py-3 border-b border-[#1a1a1a]">
          <span className="text-[10px] font-mono text-[#00ff88] tracking-wider">
            COMING SOON
          </span>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* App Icon */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
              <Image
                src="/icon.png"
                alt="ガチトレ アプリアイコン"
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">{name}</h3>
              <p className="text-[#666] text-xs">{tagline}</p>
            </div>
          </div>

          {/* Coming Soon Badge */}
          <div className="mb-4 py-2 px-3 bg-[#00ff88]/10 rounded-lg border border-[#00ff88]/20">
            <p className="text-[#00ff88] text-xs font-bold text-center">
              近日公開予定
            </p>
          </div>

          {/* Description */}
          <p className="text-[#aaa] text-xs leading-relaxed mb-4">
            {description}
          </p>

          {/* Features */}
          <ul className="space-y-2 mb-4">
            {features.map((feature) => (
              <li
                key={feature}
                className="flex items-center gap-2 text-xs text-[#888]"
              >
                <CheckIcon />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          {/* Pre-register Button */}
          <button
            type="button"
            className="flex items-center justify-center gap-2 w-full py-3 bg-[#00ff88] text-black font-bold text-xs rounded hover:bg-[#00cc6a] transition-colors"
            onClick={() => {
              router.push(config.preRegisterUrl);
            }}
          >
            <BellIcon />
            事前登録する
          </button>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-[#050505] border-t border-[#1a1a1a]">
          <p className="text-[10px] text-[#555] text-center font-mono">
            リリース時に通知を受け取れます
          </p>
        </div>
      </div>
    </aside>
  );
}
