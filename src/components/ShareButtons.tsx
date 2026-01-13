"use client";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: "X",
      href: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
      bgColor: "hover:bg-[#1da1f2]/20 hover:border-[#1da1f2]",
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
      bgColor: "hover:bg-[#1877f2]/20 hover:border-[#1877f2]",
    },
    {
      name: "LINE",
      href: `https://social-plugins.line.me/lineit/share?url=${encodedUrl}`,
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.365 9.863c.349 0 .63.285.63.631 0 .345-.281.63-.63.63H17.61v1.125h1.755c.349 0 .63.283.63.63 0 .344-.281.629-.63.629h-2.386c-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63h2.386c.346 0 .627.285.627.63 0 .349-.281.63-.63.63H17.61v1.125h1.755zm-3.855 3.016c0 .27-.174.51-.432.596-.064.021-.133.031-.199.031-.211 0-.391-.09-.51-.25l-2.443-3.317v2.94c0 .344-.279.629-.631.629-.346 0-.626-.285-.626-.629V8.108c0-.27.173-.51.43-.595.06-.023.136-.033.194-.033.195 0 .375.104.495.254l2.462 3.33V8.108c0-.345.282-.63.63-.63.345 0 .63.285.63.63v4.771zm-5.741 0c0 .344-.282.629-.631.629-.345 0-.627-.285-.627-.629V8.108c0-.345.282-.63.63-.63.346 0 .628.285.628.63v4.771zm-2.466.629H4.917c-.345 0-.63-.285-.63-.629V8.108c0-.345.285-.63.63-.63.348 0 .63.285.63.63v4.141h1.756c.348 0 .629.283.629.63 0 .344-.282.629-.629.629M24 10.314C24 4.943 18.615.572 12 .572S0 4.943 0 10.314c0 4.811 4.27 8.842 10.035 9.608.391.082.923.258 1.058.59.12.301.079.766.038 1.08l-.164 1.02c-.045.301-.24 1.186 1.049.645 1.291-.539 6.916-4.078 9.436-6.975C23.176 14.393 24 12.458 24 10.314" />
        </svg>
      ),
      bgColor: "hover:bg-[#00b900]/20 hover:border-[#00b900]",
    },
    {
      name: "はてブ",
      href: `https://b.hatena.ne.jp/entry/${url}`,
      icon: (
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.47 0C22.42 0 24 1.58 24 3.53v16.94c0 1.95-1.58 3.53-3.53 3.53H3.53C1.58 24 0 22.42 0 20.47V3.53C0 1.58 1.58 0 3.53 0h16.94zm-3.705 14.47c-.78 0-1.41.63-1.41 1.41s.63 1.414 1.41 1.414 1.41-.634 1.41-1.414-.63-1.41-1.41-1.41zM8.61 17.247h1.8l-.6-2.91-.45-2.19-.12-.57h-.06l-.12.57-.45 2.19-.6 2.91h.6zm6.855-8.06c-.06-.36-.18-.66-.36-.9-.18-.24-.42-.42-.72-.54-.3-.12-.66-.18-1.08-.18H8.87v9.93h4.38c.48 0 .9-.06 1.26-.18.36-.12.66-.3.9-.54.24-.24.42-.54.54-.9.12-.36.18-.78.18-1.26 0-.6-.12-1.08-.36-1.44-.24-.36-.6-.6-1.08-.72v-.06c.36-.12.63-.36.81-.72.18-.36.27-.78.27-1.26 0-.42-.06-.78-.18-1.08zm-2.1 5.52c0 .3-.06.54-.18.72-.12.18-.3.3-.54.36-.24.06-.54.09-.9.09h-1.62v-2.46h1.62c.48 0 .84.09 1.08.27.3.18.45.54.54 1.02zm-.24-3.72c0 .24-.03.45-.09.63-.06.18-.15.33-.27.45-.12.12-.27.21-.45.27-.18.06-.39.09-.63.09h-1.26v-2.82h1.26c.24 0 .45.03.63.09.18.06.33.15.45.27.12.12.21.27.27.45.06.18.09.39.09.63v.04z" />
        </svg>
      ),
      bgColor: "hover:bg-[#00a4de]/20 hover:border-[#00a4de]",
    },
    {
      name: "コピー",
      href: "#",
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      ),
      bgColor: "hover:bg-[#00ff88]/20 hover:border-[#00ff88]",
      onClick: () => {
        navigator.clipboard.writeText(url);
        alert("URLをコピーしました");
      },
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] text-[#666] font-mono mr-2">SHARE:</span>
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.href}
          onClick={(e) => {
            if (link.onClick) {
              e.preventDefault();
              link.onClick();
            }
          }}
          target={link.onClick ? undefined : "_blank"}
          rel={link.onClick ? undefined : "noopener noreferrer"}
          className={`p-2 border border-[#333] text-[#888] transition-all duration-200 ${link.bgColor}`}
          title={link.name}
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
}

