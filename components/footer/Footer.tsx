import { NAV_LINKS, SITE } from "@/lib/constants";

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink px-6 py-14 md:px-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 text-center">
        <span className="font-display text-ivory text-xl tracking-[0.3em]">
          {SITE.name}
        </span>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="eyebrow text-mist hover:text-ivory transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-8 eyebrow text-mist">
          <a href="#" className="hover:text-ivory transition-colors duration-300">
            Instagram
          </a>
          <a href="#" className="hover:text-ivory transition-colors duration-300">
            Pinterest
          </a>
        </div>

        <p className="text-xs text-mist/60">
          © 2026 {SITE.name} — {SITE.tagline}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
