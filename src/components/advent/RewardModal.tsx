import type { Reward } from "@/lib/advent-api";
import { rarityClass, rarityGlow, rewardImage } from "./rewards";

interface Props { day: number; reward: Reward; claimed: boolean; onClaim: () => void; onClose: () => void; claiming: boolean }

export function RewardModal({ day, reward, claimed, onClaim, onClose, claiming }: Props) {
  const glow = rarityGlow[reward.rarity];
  return (
    <div role="dialog" aria-modal="true" aria-label={`Day ${day} reward`} className="fixed inset-0 z-50 flex items-center justify-center bg-night/85 p-5 backdrop-blur-sm" onClick={onClose}>
      <div className="animate-pop-in relative w-full max-w-sm" onClick={(e) => e.stopPropagation()}>
        {/* bow ornament */}
        <svg viewBox="0 0 120 50" aria-hidden className="absolute -top-7 left-1/2 z-20 w-28 -translate-x-1/2 drop-shadow-[0_4px_6px_rgba(0,0,0,0.6)]">
          <path d="M10 30 Q30 18 60 28 Q90 18 110 30 Q90 38 60 34 Q30 38 10 30Z" fill="oklch(0.45 0.12 150)" />
          <path d="M60 26 C40 2 18 6 22 22 C25 32 48 30 60 26Z M60 26 C80 2 102 6 98 22 C95 32 72 30 60 26Z" fill="oklch(0.55 0.22 27)" />
          <path d="M56 26 L46 48 L54 45 L60 32 L66 45 L74 48 L64 26Z" fill="oklch(0.5 0.2 27)" />
          <circle cx="60" cy="26" r="6" fill="var(--gold)" />
        </svg>
        <div className="relative overflow-hidden rounded-[1.75rem] p-[3px]" style={{ background: "linear-gradient(145deg, oklch(0.95 0.1 92), oklch(0.7 0.14 68), oklch(0.9 0.12 85), oklch(0.55 0.11 60))", boxShadow: "0 0 40px -6px var(--gold), 0 30px 60px -20px black" }}>
          <span className="snow-crest !top-[-3px] !h-4" />
          <div className="relative overflow-hidden rounded-[1.6rem] px-6 pb-6 pt-9 text-center" style={{ background: "radial-gradient(100% 70% at 50% 35%, oklch(0.3 0.09 255), oklch(0.13 0.05 260) 75%)" }}>
            <button onClick={onClose} aria-label="Close" className="absolute right-3 top-3 z-10 grid size-8 place-items-center rounded-full bg-muted/70 text-muted-foreground hover:text-foreground">✕</button>
            <p className="title-3d text-xl uppercase">Day {day} Unlocked</p>
            <div className="mx-auto mt-1 flex items-center justify-center gap-2 text-gold"><span className="h-px w-12 bg-linear-to-r from-transparent to-gold" />♛<span className="h-px w-12 bg-linear-to-l from-transparent to-gold" /></div>
            <p className={`title-3d mt-1 text-2xl uppercase`}>{reward.rarity} Reward!</p>

            <div className="relative mx-auto my-3 grid size-56 place-items-center">
              <div aria-hidden className="animate-rays absolute -inset-10 opacity-90" style={{ background: "repeating-conic-gradient(from 0deg, oklch(0.92 0.13 88 / 0.55) 0deg 6deg, transparent 6deg 20deg)", maskImage: "radial-gradient(circle, black 15%, transparent 68%)" }} />
              <div aria-hidden className="absolute inset-10 rounded-full blur-2xl" style={{ background: glow, opacity: 0.6 }} />
              <div aria-hidden className="absolute inset-14 rounded-full bg-gold-soft opacity-60 blur-xl" />
              <img src={rewardImage[reward.type]} alt={reward.title} className="animate-float relative size-36 object-contain drop-shadow-[0_14px_20px_rgba(0,0,0,0.6)]" />
            </div>

            <span className={`inline-block rounded-full border bg-night/60 px-3 py-0.5 font-display text-xs font-semibold uppercase tracking-widest ${rarityClass[reward.rarity]}`}>{reward.rarity}</span>
            <h2 className="mt-2 font-display text-3xl font-bold text-gold-gradient">{reward.amount}</h2>
            <p className="text-sm text-muted-foreground">{reward.title}</p>

            <button
              onClick={onClaim}
              disabled={claimed || claiming}
              className="btn-shine relative mt-5 w-full overflow-hidden rounded-full p-[3px] transition active:scale-[0.98] disabled:opacity-70"
              style={{ background: "var(--gradient-gold)", boxShadow: "0 10px 28px -8px var(--emerald), 0 0 18px -4px var(--gold)" }}
            >
              <span className="flex items-center justify-center gap-3 rounded-full py-3.5 font-serif text-xl font-black uppercase tracking-wide" style={{ background: "var(--gradient-emerald)", boxShadow: "inset 0 2px 0 oklch(1 0 0 / 0.35), inset 0 -4px 8px oklch(0 0 0 / 0.3)" }}>
                <span className="text-gold-soft">❄</span>
                <span className="text-gold-gradient drop-shadow-[0_2px_1px_rgba(0,0,0,0.5)]">{claimed ? "Claimed ✓" : claiming ? "Claiming…" : "Claim Bonus"}</span>
                <span className="text-gold-soft">❄</span>
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
