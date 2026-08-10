"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Craftsmanship() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduced) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".craft-reveal",
        { opacity: 0, y: 48 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.12,
          ease: "power3.out",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 70%",
          },
        }
      );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="craftsmanship"
      ref={rootRef}
      className="relative bg-ink px-6 py-28 md:px-10 md:py-44"
    >
      <div className="mx-auto grid max-w-6xl gap-16 md:grid-cols-[1.1fr_1fr] md:gap-24">
        <div>
          <p className="craft-reveal eyebrow text-gold">Craftsmanship</p>
          <h2 className="craft-reveal font-display text-ivory mt-6 leading-[1.02] text-[clamp(2.5rem,6vw,5rem)]">
            Crafted
            <br />
            by hand.
          </h2>
        </div>

        <div className="md:pt-16">
          <p className="craft-reveal text-mist leading-relaxed text-base md:text-lg">
            Every curve. Every surface. Every detail.
          </p>
          <p className="craft-reveal text-mist mt-6 max-w-md leading-relaxed text-base md:text-lg">
            Each piece is shaped through precision, patience and
            extraordinary craftsmanship — a quiet dialogue between the
            hand and the material.
          </p>
          <p className="craft-reveal eyebrow mt-14 text-mist">
            The sketch · The form · The stone · The finish
          </p>
        </div>
      </div>
    </section>
  );
}
