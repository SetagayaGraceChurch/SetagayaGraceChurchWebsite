import { useEffect, useState } from "react";
import { Instagram } from "lucide-react";
import logoImg from "../../assets/logo-cropped.jpg";

const logoSrc = typeof logoImg === "object" && logoImg && "src" in logoImg ? logoImg.src : logoImg;

export type NavItem = {
  label: string;
  href: string;
};

export const navItems: NavItem[] = [
  { label: "ホーム", href: "/" },
  { label: "初めての方へ", href: "/welcome" },
  { label: "教会について", href: "/aboutourchurch" },
  { label: "礼拝", href: "/worship" },
  { label: "キリスト教について", href: "/christianity" },
  { label: "集まり", href: "/community" },
  { label: "イベント", href: "/events" },
  { label: "説教", href: "/sermons" },
  { label: "アクセス", href: "/access" },
];

export function isActivePath(currentPath: string, href: string) {
  const [targetPath] = href.split("#");

  if (targetPath === "/") {
    return currentPath === "/";
  }

  return currentPath === targetPath;
}

export function SiteHeader({ currentPath }: { currentPath: string }) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [currentPath]);

  return (
    <header className="sticky top-0 z-50 border-b border-white/15 bg-[#789564] shadow-[0_10px_30px_rgba(58,77,61,0.18)]">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 sm:px-6">
        <a href="/" aria-label="ホーム" className="flex items-center">
          <img
            src={logoSrc}
            alt="世田谷グレースチャーチ ロゴ"
            className="h-10 w-auto object-contain"
          />
        </a>
        <nav className="hidden items-center gap-4 md:flex">
          {navItems.map((item) => {
            const active = isActivePath(currentPath, item.href);
            return (
              <a
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  active ? "text-white" : "text-white/90 hover:text-white"
                }`}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
        <button className="p-2 md:hidden" onClick={() => setMenuOpen((open) => !open)} aria-label="メニュー">
          <div className="mb-1 h-0.5 w-5 bg-white" />
          <div className="mb-1 h-0.5 w-5 bg-white" />
          <div className="h-0.5 w-5 bg-white" />
        </button>
      </div>
      {menuOpen && (
        <div className="flex flex-col gap-4 border-t border-white/20 bg-[#789564] px-6 py-4 md:hidden">
          {navItems.map((item) => {
            const active = isActivePath(currentPath, item.href);
            return (
              <a
                key={item.href}
                href={item.href}
                className={`text-sm ${active ? "text-white" : "text-white/90 hover:text-white"}`}
              >
                {item.label}
              </a>
            );
          })}
        </div>
      )}
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="bg-[#253229] py-10 text-[#b8c4b8]">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-6 text-sm sm:flex-row sm:items-end">
        <div>
          <p className="mb-1 text-white">世田谷グレースチャーチ</p>
          <p>日本宣教会 代田教会</p>
          <p>東京都世田谷区羽根木1丁目19-2</p>
          <p className="mt-1">毎週日曜日 15:00〜</p>
        </div>
        <div>
          <p className="text-xs">© 2026 世田谷グレースチャーチ</p>
          <p className="mt-1 text-xs">info@setagaya-church.jp</p>
          <a
            href="https://www.instagram.com/setagaya.grace/"
            target="_blank"
            rel="noreferrer"
            aria-label="世田谷グレースチャーチのInstagram"
            className="mt-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:border-white/40 hover:bg-white/10"
          >
            <Instagram aria-hidden="true" className="h-4 w-4" strokeWidth={2.2} />
          </a>
        </div>
      </div>
    </footer>
  );
}

export function SiteLayout({
  currentPath,
  children,
}: {
  currentPath: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#fcfbf7] font-sans text-[#304034]">
      <SiteHeader currentPath={currentPath} />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

export function InternalLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}
