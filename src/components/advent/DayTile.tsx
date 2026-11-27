import { useState } from "react";
import type { CalendarDay, DayState } from "@/lib/advent-api";
import { rarityGlow, rewardImage } from "./rewards";

interface Props { day: CalendarDay; state: DayState; onOpen: (id: number) => Promise<void> }

export function DayTile({ day, state, onOpen }: Props) {
  const [opening, setOpening] = useState(false);
  const big = day.id === 24;

  const click = async () => {
    if (opening) return;
    if (state === "opened") return void onOpen(day.id);
    setOpening(true);
    await new Promise((r) => setTimeout(r, 550));
    await onOpen(day.id);
    setOpening(false);
  };

  const showInside = state === "opened" || opening;
  return (
    <button
      onClick={click}
      aria-label={`December ${day.id}${state === "opened" ? ", opened" : state === "today" ? ", today" : state === "locked" ? ", future day" : ""}`}
      className={`group relative aspect-square overflow-hidden rounded-2xl transition active:scale-95 ${state === "today" ? "gold-frame animate-pulse-glow" : "gold-frame"} ${state === "locked" ? "opacity-70" : ""}`}
    >
      {/* inside */}
      <div className="absolute inset-0 grid place-items-center bg-night/80">
        {showInside && day.reward && (
          <>
            <div className="absolute inset-0 opacity-50 blur-xl" style={{ background: `radial-gradient(circle, ${rarityGlow[day.reward.rarity]}, transparent 65%)` }} />
            <img src={rewardImage[day.reward.type]} alt="" className="relative w-3/5 object-contain" />
          </>
        )}
        {showInside && !day.reward && <div className="size-6 animate-spin rounded-full border-2 border-gold border-t-transparent" />}
        {state === "opened" && <span className="absolute bottom-1 right-1.5 font-display text-[10px] font-bold text-gold">{day.id}</span>}
        {state === "opened" && day.claimed && <span className="absolute left-1.5 top-1 text-[10px] text-gold">✓</span>}
      </div>

      {/* door */}
      {state !== "opened" && (
        <div className={`glass absolute inset-0 flex flex-col items-center justify-center ${opening ? "animate-door-open" : ""}`}>
          <span aria-hidden className="absolute inset-x-0 top-0 h-1/2 bg-linear-to-b from-foreground/10 to-transparent" />
          <span className={`font-display font-bold leading-none ${"text-2xl"} ${state === "today" ? "text-gold-gradient" : "text-foreground/90"}`}>{day.id}</span>
          {state === "today" && <span className="mt-1 text-[9px] font-semibold uppercase tracking-widest text-gold">Today</span>}
          {state === "locked" && <span className="mt-1 text-[10px] text-muted-foreground">❄</span>}
          {big && <span className="absolute top-1 text-xs">🎁</span>}
          {opening && <span aria-hidden className="absolute inset-0 bg-linear-to-r from-gold/0 via-gold/50 to-gold/0" />}
        </div>
      )}
    </button>
  );
}
