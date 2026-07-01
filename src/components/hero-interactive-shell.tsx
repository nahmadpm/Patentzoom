"use client";

import { ReactNode, useMemo, useState } from "react";

type PointerState = {
  x: number;
  y: number;
  tiltX: number;
  tiltY: number;
  glowX: string;
  glowY: string;
  imageX: string;
  imageY: string;
};

const initialPointerState: PointerState = {
  x: 50,
  y: 50,
  tiltX: 0,
  tiltY: 0,
  glowX: "50%",
  glowY: "50%",
  imageX: "50%",
  imageY: "50%",
};

export function HeroInteractiveShell({
  backgroundImage,
  content,
  card,
}: {
  backgroundImage: string;
  content: ReactNode;
  card: ReactNode;
}) {
  const [pointer, setPointer] = useState<PointerState>(initialPointerState);

  const backgroundPosition = useMemo(
    () => `${pointer.imageX} ${pointer.imageY}`,
    [pointer.imageX, pointer.imageY],
  );

  function handlePointerMove(event: React.PointerEvent<HTMLElement>) {
    if (event.pointerType === "touch") {
      return;
    }

    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / bounds.width) * 100;
    const y = ((event.clientY - bounds.top) / bounds.height) * 100;

    setPointer({
      x,
      y,
      tiltX: (50 - y) / 16.7,
      tiltY: (x - 50) / 16.7,
      glowX: `${x}%`,
      glowY: `${y}%`,
      imageX: `${50 + (x - 50) * 0.035}%`,
      imageY: `${50 + (y - 50) * 0.025}%`,
    });
  }

  function handlePointerLeave() {
    setPointer(initialPointerState);
  }

  return (
    <section
      className="hero-shell relative overflow-hidden bg-white"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={
        {
          "--hero-glow-x": pointer.glowX,
          "--hero-glow-y": pointer.glowY,
          "--hero-tilt-x": `${pointer.tiltX}deg`,
          "--hero-tilt-y": `${pointer.tiltY}deg`,
        } as React.CSSProperties
      }
    >
      <div
        className="hero-background-layer border-b border-slate-200 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('${backgroundImage}')`,
          backgroundPosition,
        }}
      >
        <div className="hero-dark-gradient absolute inset-0" />
        <div className="hero-blur-overlay absolute inset-0" />
        <div className="hero-cursor-glow absolute inset-0" />
        <div className="hero-cursor-highlight absolute inset-0" />

        <div className="relative mx-auto grid w-full max-w-7xl gap-5 px-5 py-6 sm:gap-7 sm:px-6 sm:py-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:px-10 lg:py-12">
          <div className="hero-content relative self-center pt-1 sm:pt-2 lg:pt-20">
            {content}
          </div>

          <div className="hero-card-wrap relative -mt-1 mx-auto w-full max-w-[22.75rem] self-start justify-self-stretch sm:max-w-[25rem] lg:mx-0 lg:mt-0 lg:w-[430px] lg:max-w-none lg:justify-self-end">
            {card}
          </div>
        </div>
      </div>
    </section>
  );
}
