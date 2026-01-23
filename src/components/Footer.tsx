import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-[#1a1a1a]">
      <div className="container py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Logo & Copyright */}
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-1">
              <span className="text-[#00ff88] font-bold">GACHI</span>
              <span className="text-white font-bold">TORE</span>
            </Link>
            <span className="text-[#333]">|</span>
            <span className="text-[#666] text-xs font-mono">© {currentYear}</span>
          </div>

          {/* Links */}
          <nav className="flex items-center gap-6 text-xs font-mono">
            <Link href="/posts" className="text-[#666] hover:text-[#00ff88] transition-colors">
              ARTICLES
            </Link>
            <Link href="/categories" className="text-[#666] hover:text-[#00ff88] transition-colors">
              CATEGORIES
            </Link>
            <Link href="/contact" className="text-[#666] hover:text-[#00ff88] transition-colors">
              CONTACT
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
