"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { heroState } from "@/lib/heroState";
import { onReady } from "@/lib/experience";
import HeroScene from "./HeroScene";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const section = sectionRef.current;
    const stage = stageRef.current;
    const headline = headlineRef.current;
    const sub = subRef.current;
    const hint = hintRef.current;

    if (
      reduced ||
      !section ||
      !stage ||
      !headline ||
      !sub ||
      !hint
    ) {
      heroState.progress = 0;
      heroState.intro = 1;
      return;
    }

    gsap.set([headline, sub, hint], { opacity: 0 });

    const intro = gsap.timeline();
    intro
      .to(heroState, {
        intro: 1,
        duration: 2.2,
        ease: "power2.inOut",
      })
      .to(
        headline,
        { opacity: 1, y: 0, duration: 1.4, ease: "power3.out" },
        0.45
      )
      .to(
        sub,
        { opacity: 1, y: 0, duration: 1.2, ease: "power3.out" },
        0.9
      )
      .to(hint, { opacity: 1, duration: 1.1, ease: "power2.out" }, 1.5);

    intro.pause();
    onReady(() => {
      intro.play();
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
      },
      onUpdate: () => {
        heroState.progress = tl.progress();
      },
    });

    tl.to(headline, { opacity: 0, yPercent: -40, ease: "none", immediateRender: false }, 0.3)
      .to(sub, { opacity: 0, ease: "none", immediateRender: false }, 0.38)
      .to(hint, { opacity: 0, ease: "none", immediateRender: false }, 0.08)
      .to(stage, { opacity: 0, ease: "none", immediateRender: false }, 0.9);

    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      intro.kill();
      tl.kill();
    };
  }, []);

  return (
    <section
      id="top"
      ref={sectionRef}
      className="hero-scroll relative"
    >
      <div
        ref={stageRef}
        className="sticky top-0 h-screen w-full overflow-hidden bg-ink"
      >
        <HeroScene />

        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-[58%] -translate-y-1/2 flex flex-col items-center px-6 text-center">
            <h1
              ref={headlineRef}
              className="font-display text-ivory leading-[0.95] tracking-wide text-[clamp(2.75rem,8vw,7.5rem)]"
            >
              THE ART
              <br />
              OF JEWELLERY
            </h1>
            <p
              ref={subRef}
              className="mt-7 text-xs md:text-sm tracking-[0.22em] uppercase text-mist"
            >
              Crafted with precision. Designed to endure.
            </p>
          </div>

          <p
            ref={hintRef}
            className="absolute inset-x-0 bottom-9 text-center eyebrow text-mist"
          >
            Scroll to discover
          </p>
        </div>
      </div>
    </section>
  );
}
