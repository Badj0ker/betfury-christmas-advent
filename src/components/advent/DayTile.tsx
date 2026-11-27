import { useState } from "react";
import type { CalendarDay, DayState } from "@/lib/advent-api";
import { rarityGlow, rewardImage } from "./rewards";

interface Props { day: CalendarDay; state: DayState; onOpen: (id: number) => Promise<void> }

function Flake({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className={className} fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <path d="M12 2v20M3.3 7l17.4 10M3.3 17L20.7 7M12 5l-2-2M12 5l2-2M12 19l-2 2M12 19l2 2" />
    </svg>
  );
}

export function DayTile({ day, state, onOpen }: Props) {
  const [opening, setOpening] = useState(false);
  const eve = day.id === 24;
  const opened = state === "opened";

  const click = async () => {
    if (opening) return;
    if (opened) return void onOpen(day.id);
    setOpening(true);
    await onOpen(day.id);
    setOpening(false);
  };

  const doorClass = opening ? "is-open" : opened ? "is-ajar" : "";
  return (
    <button
      onClick={click}
      aria-label={`December ${day.id}${opened ? ", opened" : state === "today" ? ", today" : state === "locked" ? ", future day" : ""}`}
      className={`vault group relative aspect-[1/0.92] transition active:scale-95 ${state === "locked" ? "saturate-[0.7]" : ""}`}
    >
      <span className="snow-crest" />
      <span className={`vault-frame ${state === "today" ? "animate-pulse-glow" : ""} ${eve ? "shadow-[0_0_22px_-2px_var(--gold)]" : ""}`} />

      {/* inside: glowing reward */}
      <span className="vault-inner grid place-items-center">
        {(opened || opening) && day.reward && (
          <>
            <span className="absolute inset-0" style={{ background: `radial-gradient(circle, color-mix(in oklab, ${rarityGlow[day.reward.rarity]} 70%, transparent), transparent 65%)` }} />
            <span aria-hidden className="animate-rays absolute -inset-4 opacity-50" style={{ background: "repeating-conic-gradient(from 0deg, oklch(0.9 0.12 85 / 0.5) 0 8deg, transparent 8deg 24deg)", maskImage: "radial-gradient(circle, black 20%, transparent 65%)" }} />
            <img src={rewardImage[day.reward.type]} alt="" className={`relative ml-[22%] w-[58%] object-contain drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)] ${opening ? "animate-reward-flash" : ""}`} />
          </>
        )}
        {day.claimed && <span className="absolute right-1.5 top-1 text-[10px] font-bold text-gold">✓</span>}
      </span>

      {/* 3D door */}
      <span className={`vault-door flex flex-col items-center justify-center ${doorClass}`}>
        <span className="rivet left-1.5 top-1.5" /><span className="rivet right-1.5 top-1.5" />
        <span className="rivet bottom-1.5 left-1.5" /><span className="rivet bottom-1.5 right-1.5" />
        <span className="ice-corner left-2.5 top-2.5 rounded-tl-md border-l border-t" />
        <span className="ice-corner right-2.5 top-2.5 rounded-tr-md border-r border-t" />
        <span className="ice-corner bottom-2.5 left-2.5 rounded-bl-md border-b border-l" />
        <span className="ice-corner bottom-2.5 right-2.5 rounded-br-md border-b border-r" />
        <span className="absolute right-0.5 top-1/2 h-4 w-1 -translate-y-1/2 rounded-full bg-ice/70 shadow-[0_0_6px_var(--ice)]" />
        {eve && <GiftBow />}
        <span className={`vault-num ${opened ? "text-lg" : "text-[1.7rem]"} ${eve ? "mt-2" : ""}`}>{day.id}</span>
        {!opened && <Flake className={`mt-0.5 size-3 ${state === "today" || eve ? "text-gold" : "text-ice/80"}`} />}
        {state === "today" && <span className="mt-0.5 font-display text-[8px] font-bold uppercase tracking-[0.2em] text-gold">Today</span>}
      </span>
    </button>
  );
}

function GiftBow() {
  return (
    <svg viewBox="0 0 40 20" aria-hidden className="absolute -top-1 left-1/2 w-9 -translate-x-1/2 drop-shadow-[0_2px_2px_rgba(0,0,0,0.6)]">
      <defs><linearGradient id="bow" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="var(--gold-soft)" /><stop offset="1" stopColor="var(--gold)" /></linearGradient></defs>
      <path d="M20 10 C10 0 2 2 4 9 C5 14 14 13 20 10 Z M20 10 C30 0 38 2 36 9 C35 14 26 13 20 10 Z" fill="url(#bow)" />
      <path d="M18 10 L13 20 L17 19 L20 12 L23 19 L27 20 L22 10Z" fill="url(#bow)" />
      <circle cx="20" cy="10" r="3" fill="var(--gold)" />
    </svg>
  );
}
