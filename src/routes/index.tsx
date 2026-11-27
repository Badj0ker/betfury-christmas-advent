import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import logo from "@/assets/betfury-logo.svg";
import mascot from "@/assets/fury-mascot.png.asset.json";
import { claimReward, dayState, getCalendarStatus, openDay, resetCalendar, type CalendarStatus } from "@/lib/advent-api";
import { haptic, initTelegram } from "@/lib/telegram";
import { Snow } from "@/components/advent/Snow";
import { Confetti } from "@/components/advent/Confetti";
import { DayTile } from "@/components/advent/DayTile";
import { RewardModal } from "@/components/advent/RewardModal";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BETFURY Christmas Advent Calendar" },
      { name: "description", content: "Open a window every day from December 1 to 24 and win BFG, free spins, promocodes and the Christmas BFG Box." },
      { property: "og:title", content: "BETFURY Christmas Advent Calendar" },
      { property: "og:description", content: "24 days of winter rewards with Fury." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const MILESTONES = [7, 14, 24];

function Index() {
  const [today, setToday] = useState(1);
  const [status, setStatus] = useState<CalendarStatus | null>(null);
  const [active, setActive] = useState<number | null>(null);
  const [burst, setBurst] = useState(0);
  const [claiming, setClaiming] = useState(false);

  useEffect(() => {
    initTelegram();
    const now = new Date();
    if (now.getMonth() === 11 && now.getDate() <= 24) setToday(now.getDate());
  }, []);

  const refresh = useCallback(async () => setStatus(await getCalendarStatus(today)), [today]);
  useEffect(() => { void refresh(); }, [refresh]);

  const handleOpen = async (id: number) => {
    const day = status?.days[id - 1];
    if (day?.opened) { setActive(id); return; }
    haptic("medium");
    await openDay(id);
    await refresh();
    haptic("success");
    setBurst((b) => b + 1);
    setActive(id);
  };

  const handleClaim = async () => {
    if (active == null) return;
    setClaiming(true);
    await claimReward(active);
    await refresh();
    setClaiming(false);
    haptic("light");
    setActive(null);
  };

  const streak = status?.streak ?? 0;
  const activeDay = active != null ? status?.days[active - 1] : undefined;

  return (
    <div className="min-h-screen bg-night md:py-8">
      <main className="relative mx-auto min-h-screen w-full max-w-[440px] overflow-hidden md:min-h-[860px] md:rounded-[2rem] md:border md:border-border md:shadow-[0_30px_80px_-20px_black]" style={{ background: "var(--gradient-sky)" }}>
        <Snow />
        <div className="relative z-10 px-4 pb-10 pt-5">
          {/* Header */}
          <header className="flex flex-col items-center text-center">
            <img src={logo} alt="BETFURY" className="h-8 w-auto" />
            <div className="relative mt-3 w-full">
              <img src={mascot.url} alt="Fury the raccoon in a Santa hat" fetchPriority="high" className="mx-auto h-64 w-auto object-contain [mask-image:radial-gradient(ellipse_50%_50%_at_50%_45%,black_55%,transparent_100%)]" />
            </div>
            <h1 className="-mt-6 font-display text-[1.7rem] font-bold leading-tight">
              <span className="text-gold-gradient">Christmas</span> Advent Calendar
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">Open a window every day · Dec 1 – 24</p>
          </header>

          {/* Streak */}
          <section aria-label="Streak" className="glass gold-frame mt-5 rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <p className="font-display font-semibold">🔥 Streak: <span className="text-gold">{streak} {streak === 1 ? "day" : "days"}</span></p>
              <p className="text-xs text-muted-foreground">{status?.days.filter((d) => d.opened).length ?? 0}/24 opened</p>
            </div>
            <div className="relative mt-3 h-2.5 rounded-full bg-muted">
              <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(streak / 24) * 100}%`, background: "var(--gradient-gold)", boxShadow: "0 0 12px var(--gold)" }} />
              {MILESTONES.map((m) => (
                <span key={m} className={`absolute top-1/2 grid size-5 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border text-[9px] font-bold ${streak >= m ? "border-gold bg-gold text-primary-foreground" : "border-border bg-night text-muted-foreground"}`} style={{ left: `${(m / 24) * 100}%` }}>
                  {m === 24 ? "🎁" : m}
                </span>
              ))}
            </div>
            <p className="mt-3 text-xs text-muted-foreground">Keep the streak to day 24 to unlock the Legendary Christmas BFG Box.</p>
          </section>

          {/* Grid */}
          <section aria-label="Calendar" className="mt-5 grid grid-cols-4 gap-2.5">
            {status?.days.map((d) => (
              <DayTile key={d.id} day={d} state={dayState(d, today)} onOpen={handleOpen} />
            ))}
          </section>

          {/* Legend */}
          <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1 text-[11px] text-muted-foreground">
            <span><span className="text-gold">●</span> Today</span>
            <span>✓ Opened / claimed</span>
            <span>❄ Future</span>
          </div>

          {/* Demo controls */}
          <section aria-label="Demo controls" className="glass mt-5 rounded-2xl border border-dashed border-border p-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-neon">Demo mode</p>
            <p className="mt-1 text-xs text-muted-foreground">All days are clickable for testing. Simulate the current date:</p>
            <label className="mt-3 flex items-center gap-3 text-sm">
              <span className="shrink-0">Dec {today}</span>
              <input type="range" min={1} max={24} value={today} onChange={(e) => setToday(Number(e.target.value))} className="w-full accent-[var(--gold)]" aria-label="Simulated December day" />
            </label>
            <button onClick={async () => { await resetCalendar(); await refresh(); haptic("rigid"); }} className="mt-3 w-full rounded-xl border border-border py-2 text-sm font-semibold hover:bg-muted">
              Reset progress
            </button>
          </section>
        </div>
      </main>

      {burst > 0 && <Confetti burst={burst} />}
      {activeDay?.reward && (
        <RewardModal day={activeDay.id} reward={activeDay.reward} claimed={activeDay.claimed} claiming={claiming} onClaim={handleClaim} onClose={() => setActive(null)} />
      )}
    </div>
  );
}
