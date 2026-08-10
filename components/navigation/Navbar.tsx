"use client";

import { useCallback, useEffect, useState } from "react";
import { NAV_LINKS, SITE } from "@/lib/constants";
import { getLenis } from "@/lib/scroll";

function scrollToId(href: string) {
  const lenis = getLenis();
  if (lenis) {
    lenis.scrollTo(href, { offset: 0, duration: 1.6 });
  } else {
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  }
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const lenis = getLenis();
    if (open) {
      lenis?.stop();
    } else {
      lenis?.start();
    }
  }, [open]);

  const goTo = useCallback((href: string) => {
    setOpen(false);
    requestAnimationFrame(() => scrollToId(href));
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-700 ${
          scrolled && !open ? "bg-ink/70 backdrop-blur-sm" : "bg-transparent"
        }`}
      >
        <nav className="flex items-center justify-between px-6 py-5 md:px-10">
          <button
            onClick={() => goTo("#top")}
            className="font-display text-ivory text-lg tracking-[0.3em] cursor-pointer"
            aria-label={SITE.name}
          >
            {SITE.name}
          </button>

          <div className="hidden md:flex items-center gap-10">
            {NAV_LINKS.map((link) => (
              <button
                key={link.href}
                onClick={() => goTo(link.href)}
                className="eyebrow text-mist hover:text-ivory transition-colors duration-300 cursor-pointer"
              >
                {link.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setOpen((value) => !value)}
            className="md:hidden flex flex-col items-end gap-1.5 p-2 cursor-pointer"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span
              className={`h-px w-6 bg-ivory transition-transform duration-300 origin-center ${
                open ? "rotate-45 translate-y-[3.5px]" : ""
              }`}
            />
            <span
              className={`h-px w-6 bg-ivory transition-transform duration-300 origin-center ${
                open ? "-rotate-45 -translate-y-[3.5px]" : ""
              }`}
            />
          </button>
        </nav>
      </header>

      <div
        className={`fixed inset-0 z-40 bg-ink md:hidden menu-clip ${
          open ? "menu-clip-open" : ""
        }`}
        aria-hidden={!open}
      >
        <div className="flex h-full flex-col justify-center px-8">
          {NAV_LINKS.map((link, index) => (
            <button
              key={link.href}
              onClick={() => goTo(link.href)}
              className="group flex items-baseline gap-4 border-b border-line py-5 text-left cursor-pointer"
            >
              <span className="eyebrow text-gold">
                0{index + 1}
              </span>
              <span className="font-display text-ivory text-3xl tracking-wide group-hover:italic transition-all duration-300">
                {link.label}
              </span>
            </button>
          ))}
          <p className="mt-10 eyebrow text-mist">{SITE.email}</p>
        </div>
      </div>
    </>
  );
}
