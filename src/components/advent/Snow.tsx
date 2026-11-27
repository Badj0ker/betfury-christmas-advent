import { useEffect, useState } from "react";

interface Flake { left: number; size: number; dur: number; delay: number; drift: number; op: number }

export function Snow({ count = 45 }: { count?: number }) {
  const [flakes, setFlakes] = useState<Flake[]>([]);
  useEffect(() => {
    setFlakes(
      Array.from({ length: count }, () => ({
        left: Math.random() * 100,
        size: 2 + Math.random() * 4,
        dur: 8 + Math.random() * 10,
        delay: -Math.random() * 18,
        drift: -30 + Math.random() * 60,
        op: 0.35 + Math.random() * 0.55,
      })),
    );
  }, [count]);
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {flakes.map((f, i) => (
        <span
          key={i}
          className="snowflake absolute -top-3 rounded-full bg-foreground"
          style={{
            left: `${f.left}%`, width: f.size, height: f.size, opacity: f.op,
            animation: `snow ${f.dur}s linear ${f.delay}s infinite`,
            ["--drift" as string]: `${f.drift}px`,
            filter: "blur(0.5px)",
          }}
        />
      ))}
    </div>
  );
}
