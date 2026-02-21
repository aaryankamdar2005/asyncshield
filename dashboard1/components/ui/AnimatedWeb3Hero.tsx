"use client";
import React, { useState, useEffect } from "react";

export function Web3HeroAnimated() {
  const pillars = [92, 84, 78, 70, 62, 54, 46, 34, 18, 34, 46, 54, 62, 70, 78, 84, 92];
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section className="absolute inset-0 overflow-hidden text-foreground z-0" style={{ backgroundColor: "var(--surface-0)" }}>
      {/* Radial background glow */}
      <div
        aria-hidden
        className="absolute inset-0 -z-30"
        style={{
          backgroundImage: [
            "radial-gradient(80% 55% at 50% 52%, rgba(244,63,94,0.3) 0%, rgba(214,76,82,0.28) 27%, rgba(61,36,47,0.2) 47%, rgba(39,38,67,0.3) 60%, rgba(3,3,5,0.92) 78%, rgba(3,3,5,1) 88%)",
            "radial-gradient(85% 60% at 14% 0%, rgba(244,63,94,0.4) 0%, rgba(233,109,99,0.32) 30%, rgba(48,24,28,0.0) 64%)",
            "radial-gradient(70% 50% at 86% 22%, rgba(99,102,241,0.28) 0%, rgba(16,18,28,0.0) 55%)",
            "linear-gradient(to bottom, rgba(3,3,5,0.25), rgba(3,3,5,0) 40%)",
          ].join(","),
          backgroundColor: "var(--surface-0)",
        }}
      />

      {/* Vignette */}
      <div
        aria-hidden
        className="absolute inset-0 -z-20"
        style={{ background: "radial-gradient(140% 120% at 50% 0%, transparent 60%, rgba(3,3,5,0.85))" }}
      />

      {/* Grid overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 mix-blend-screen opacity-20"
        style={{
          backgroundImage: [
            "repeating-linear-gradient(90deg, rgba(228,228,237,0.06) 0 1px, transparent 1px 96px)",
            "repeating-linear-gradient(0deg, rgba(228,228,237,0.04) 0 1px, transparent 1px 96px)",
          ].join(","),
        }}
      />

      {/* Floating center glow */}
      <div
        className="pointer-events-none absolute bottom-[128px] left-1/2 z-0 h-36 w-28 -translate-x-1/2 rounded-md"
        style={{
          background: "linear-gradient(to bottom, rgba(244,63,94,0.5), rgba(244,63,94,0.2), transparent)",
          animation: "subtlePulse 6s ease-in-out infinite",
        }}
      />

      {/* Pillar bars */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[54vh]">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, var(--surface-0), rgba(3,3,5,0.9), transparent)" }}
        />
        <div className="absolute inset-x-0 bottom-0 flex h-full items-end gap-px px-[2px]">
          {pillars.map((h, i) => (
            <div
              key={i}
              className="flex-1 transition-all duration-1000 ease-in-out"
              style={{
                height: isMounted ? `${h}%` : "0%",
                transitionDelay: `${Math.abs(i - Math.floor(pillars.length / 2)) * 60}ms`,
                background: "linear-gradient(to top, rgba(99,102,241,0.08), rgba(244,63,94,0.06), transparent)",
                borderTop: "1px solid rgba(228,228,237,0.06)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
