import { useMemo } from "react";

const COLORS = ["var(--gold)", "var(--neon)", "var(--neon-pink)", "var(--gold-soft)", "var(--rarity-epic)"];

export function Confetti({ burst }: { burst: number }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => ({
        left: 50 + (Math.random() - 0.5) * 30,
        dx: `${(Math.random() - 0.5) * 380}px`,
        rot: `${Math.random() * 720 - 360}deg`,
        delay: Math.random() * 0.25,
        dur: 1.4 + Math.random() * 1.2,
        w: 5 + Math.random() * 6,
        color: COLORS[i % COLORS.length],
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [burst],
  );
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {pieces.map((p, i) => (
        <span
          key={`${burst}-${i}`}
          className="absolute top-[30%] rounded-[2px]"
          style={{
            left: `${p.left}%`, width: p.w, height: p.w * 0.45, background: p.color,
            ["--dx" as string]: p.dx, ["--rot" as string]: p.rot,
            animation: `confetti-fall ${p.dur}s cubic-bezier(.2,.6,.4,1) ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
}
