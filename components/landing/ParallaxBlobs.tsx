"use client";

import { useEffect, useRef } from "react";

// Замінює статичні (тільки animate-pulse) розмиті плями фону на версії, що
// ще й трохи зсуваються відносно скролу — легкий ефект глибини. Швидкість
// різна для кожної плями, щоб рух відчувався як шари, а не одна площина.
// prefers-reduced-motion — просто не чіпаємо трансформацію взагалі.
function useParallax(speed: number) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    let raf = 0;

    function update() {
      if (!el) return;
      el.style.transform = `translateY(${(window.scrollY * speed).toFixed(1)}px)`;
      raf = 0;
    }
    function onScroll() {
      if (!raf) raf = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [speed]);

  return ref;
}

export default function ParallaxBlobs() {
  const blobA = useParallax(0.15);
  const blobB = useParallax(-0.1);
  const blobC = useParallax(0.05);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div
        ref={blobA}
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-20 bg-cyan-500 animate-pulse"
        style={{ animationDuration: "4s" }}
      />
      <div
        ref={blobB}
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-10 bg-teal-500 animate-pulse"
        style={{ animationDuration: "6s" }}
      />
      <div
        ref={blobC}
        className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full blur-3xl opacity-5 bg-blue-500 animate-pulse"
        style={{ animationDuration: "8s" }}
      />
    </div>
  );
}
