"use client";

import { useEffect, useRef } from "react";

export default function AnimatedBackground() {
  const embersRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = embersRef.current;
    if (!container) return;

    for (let i = 0; i < 35; i++) {
      const ember = document.createElement("span");
      ember.className = "ember";
      const left = Math.random() * 100;
      const bottom = -5 + Math.random() * 30;
      const delay = Math.random() * 14;
      const duration = 14 + Math.random() * 18;
      const size = 2 + Math.random() * 4;
      const rise = 30 + Math.random() * 55;
      const dx = (-10 + Math.random() * 20).toFixed(1) + "vw";

      ember.style.left = left + "vw";
      ember.style.bottom = bottom + "vh";
      ember.style.width = size + "px";
      ember.style.height = size + "px";
      ember.style.animationDuration = duration + "s";
      ember.style.animationDelay = -delay + "s";
      ember.style.setProperty("--rise", rise + "vh");
      ember.style.setProperty("--dx", dx);

      const hueRoll = Math.random();
      if (hueRoll > 0.68) ember.style.background = "rgba(91, 162, 255, 0.95)";
      if (hueRoll < 0.22) ember.style.background = "rgba(255, 108, 42, 0.95)";

      container.appendChild(ember);
    }

    return () => {
      container.innerHTML = "";
    };
  }, []);

  return (
    <div className="scene">
      {/* Boss silhouettes */}
      <div className="boss-bg zulrah" />
      <div className="boss-bg zuk" />
      <div className="boss-bg vorkath" />
      <div className="boss-bg jad" />

      {/* Orbital rings */}
      <div className="orbital-ring one" />
      <div className="orbital-ring two" />

      {/* Mist layers */}
      <div className="mist-band a" />
      <div className="mist-band b" />
      <div className="mist-band c" />

      {/* Embers */}
      <div ref={embersRef} />

      {/* Vignette */}
      <div className="vignette" />
    </div>
  );
}
