import type { Reward } from "@/lib/advent-api";
import { rarityClass, rarityGlow, rewardImage } from "./rewards";

interface Props { day: number; reward: Reward; claimed: boolean; onClaim: () => void; onClose: () => void; claiming: boolean }

export function RewardModal({ day, reward, claimed, onClaim, onClose, claiming }: Props) {
  const glow = rarityGlow[reward.rarity];
  return (
    <div role="dialog" aria-modal="true" aria-label={`Day ${day} reward`} className="fixed inset-0 z-50 flex items-center justify-center bg-night/80 p-5 backdrop-blur-sm" onClick={onClose}>
      <div className="glass gold-frame animate-pop-in relative w-full max-w-sm overflow-hidden rounded-3xl px-6 pb-6 pt-8 text-center" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Close" className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-muted/70 text-muted-foreground hover:text-foreground">✕</button>
        <p className="font-display text-sm uppercase tracking-[0.25em] text-muted-foreground">December {day}</p>
        <div className="relative mx-auto my-4 grid size-48 place-items-center">
          <div aria-hidden className="animate-rays absolute inset-0 rounded-full opacity-70" style={{ background: `repeating-conic-gradient(from 0deg, color-mix(in oklab, ${glow} 55%, transparent) 0deg 10deg, transparent 10deg 30deg)`, maskImage: "radial-gradient(circle, black 30%, transparent 70%)" }} />
          <div aria-hidden className="absolute inset-8 rounded-full blur-2xl" style={{ background: glow, opacity: 0.45 }} />
          <img src={rewardImage[reward.type]} alt={reward.title} className="animate-float relative size-32 object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]" />
        </div>
        <span className={`inline-block rounded-full border px-3 py-0.5 font-display text-xs font-semibold uppercase tracking-widest ${rarityClass[reward.rarity]}`}>{reward.rarity}</span>
        <h2 className="mt-3 font-display text-3xl font-bold text-gold-gradient">{reward.amount}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{reward.title}</p>
        <button
          onClick={onClaim}
          disabled={claimed || claiming}
          className="mt-6 w-full rounded-2xl py-3.5 font-display text-lg font-bold text-primary-foreground shadow-[0_8px_24px_-8px_var(--gold)] transition active:scale-[0.98] disabled:opacity-60"
          style={{ background: "var(--gradient-gold)" }}
        >
          {claimed ? "Claimed ✓" : claiming ? "Claiming…" : "Claim"}
        </button>
      </div>
    </div>
  );
}
