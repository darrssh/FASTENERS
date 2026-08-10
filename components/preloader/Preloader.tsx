"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { markReady } from "@/lib/experience";
import { SITE } from "@/lib/constants";

export default function Preloader() {
  const rootRef = useRef<HTMLDivElement>(null);
  const countRef = useRef<HTMLSpanElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const counter = { value: 0 };

    const tl = gsap.timeline();

    tl.fromTo(
      ".preloader-letter",
      { yPercent: 120 },
      {
        yPercent: 0,
        duration: 0.8,
        stagger: 0.06,
        ease: "power3.out",
      }
    )
      .fromTo(
        countRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
        "-=0.2"
      )
      .to(
        counter,
        {
          value: 100,
          duration: reduced ? 0.2 : 1.1,
          ease: "power2.inOut",
          onUpdate: () => {
            if (countRef.current) {
              countRef.current.textContent = String(
                Math.round(counter.value)
              ).padStart(3, "0");
            }
            if (barRef.current) {
              barRef.current.style.transform = `scaleX(${
                counter.value / 100
              })`;
            }
          },
        },
        "-=0.1"
      )
      .fromTo(
        rootRef.current,
        { clipPath: "inset(0 0 0% 0)" },
        { clipPath: "inset(0 0 100% 0)", duration: 0.9, ease: "power4.inOut" }
      )
      .add(() => {
        markReady();
        setHidden(true);
      });

    return () => {
      tl.kill();
    };
  }, []);

  if (hidden) return null;

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
    >
      <div className="overflow-hidden">
        <div className="font-display text-ivory text-4xl tracking-[0.35em] md:text-6xl flex">
          {SITE.name.split("").map((letter, index) => (
            <span key={index} className="preloader-letter inline-block">
              {letter}
            </span>
          ))}
        </div>
      </div>

      <div className="mt-10 w-56 md:w-72">
        <div className="h-px w-full bg-line overflow-hidden">
          <div
            ref={barRef}
            className="h-full w-full origin-left scale-x-0 bg-gold"
          />
        </div>
      </div>

      <span
        ref={countRef}
        className="mt-4 eyebrow text-mist"
      >
        000
      </span>
    </div>
  );
}
