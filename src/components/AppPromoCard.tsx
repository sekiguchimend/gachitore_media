import Link from "next/link";
import { APP_PROMO, type AppPromoConfig } from "@/lib/config";

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

const AppleIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

const GooglePlayIcon = () => (
  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
    <path d="M3 20.5v-17c0-.59.34-1.11.84-1.35L13.69 12l-9.85 9.85c-.5-.25-.84-.76-.84-1.35m13.81-5.38L6.05 21.34l8.49-8.49 2.27 2.27m3.35-4.31c.34.27.59.69.59 1.19s-.22.9-.57 1.18l-2.29 1.32-2.5-2.5 2.5-2.5 2.27 1.31M6.05 2.66l10.76 6.22-2.27 2.27-8.49-8.49z" />
  </svg>
);

export function AppPromoCard({ config = APP_PROMO }: Props) {
  const { name, tagline, description, features, links } = config;

  return (
    <aside className="w-full">
      <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#00ff88]/20 to-transparent px-4 py-3 border-b border-[#1a1a1a]">
          <span className="text-[10px] font-mono text-[#00ff88] tracking-wider">
            RECOMMENDED APP
          </span>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* App Icon */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#00ff88] to-[#00cc6a] flex items-center justify-center flex-shrink-0">
              <svg
                className="w-8 h-8 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16m-7 6h7"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-bold text-sm">{name}</h3>
              <p className="text-[#666] text-xs">{tagline}</p>
            </div>
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

          {/* CTA Buttons */}
          <div className="space-y-2">
            <Link
              href={links.appStore}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#00ff88] text-black font-bold text-xs rounded hover:bg-[#00cc6a] transition-colors"
            >
              <AppleIcon />
              App Store
            </Link>
            <Link
              href={links.googlePlay}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-2.5 bg-[#1a1a1a] text-white font-bold text-xs rounded border border-[#333] hover:border-[#00ff88] hover:text-[#00ff88] transition-colors"
            >
              <GooglePlayIcon />
              Google Play
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 bg-[#050505] border-t border-[#1a1a1a]">
          <p className="text-[10px] text-[#555] text-center font-mono">
            Free Download
          </p>
        </div>
      </div>
    </aside>
  );
}
