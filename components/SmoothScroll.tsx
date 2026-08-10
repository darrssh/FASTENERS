"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { setLenis } from "@/lib/scroll";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const reduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.matchMedia("(pointer: coarse)").matches;

    const lenis = new Lenis({
      lerp: reduced ? 1 : 0.09,
      smoothWheel: true,
      wheelMultiplier: 1,
    });

    setLenis(lenis);

    lenis.on("scroll", ScrollTrigger.update);

    const ticker = gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(ticker);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return <>{children}</>;
}
