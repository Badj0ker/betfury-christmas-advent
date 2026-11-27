import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import logo from "@/assets/betfury-logo.svg";
import hero from "@/assets/fury-sleigh-hero.jpg.asset.json";
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
      <main className="relative mx-auto min-h-screen w-full max-w-[440px] overflow-hidden md:min-h-[860px] md:rounded-[2rem] md:border md:border-border md:shadow-[0_30px_80px_-20px_black]" style={{ background: "var(--gradient-forest)" }}>
        <Snow count={70} />
        <svg aria-hidden viewBox="0 0 440 160" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-0 h-56 w-full text-night opacity-90">
          <path fill="currentColor" d="M0 160V90l15-30 15 30 10-50 15 50 12-35 14 35 18-60 18 60 10-25 12 25h20l14-45 14 45 16-70 16 70 12-30 12 30 18-55 18 55 12-28 12 28 16-62 16 62 14-40 14 40 15-50 15 50V160Z" />
        </svg>
        <div className="relative z-10 px-4 pb-10 pt-5">
          {/* Hero */}
          <header className="relative -mx-4 -mt-5">
            <div className="relative aspect-[849/535] w-full overflow-hidden">
              <img src={hero.url} alt="Fury the raccoon riding a Christmas sleigh through a snowy forest" fetchPriority="high" className="absolute inset-0 size-full object-cover" />
              <div aria-hidden className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-night/90 to-transparent" />
              <div aria-hidden className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-night via-night/70 to-transparent" />
              <img src={logo} alt="BETFURY" className="absolute left-1/2 top-4 h-7 w-auto -translate-x-1/2 drop-shadow-[0_2px_6px_rgba(0,0,0,0.8)]" />
            </div>
            <div className="relative -mt-16 px-4 text-center">
              <div className="flex items-center justify-center gap-2 text-gold"><span className="h-px w-10 bg-linear-to-r from-transparent to-gold" /><span className="text-ice">❄</span><span className="h-px w-10 bg-linear-to-l from-transparent to-gold" /></div>
              <h1 className="mt-1 leading-[0.95]">
                <span className="title-3d block text-[2.6rem]">CHRISTMAS</span>
                <span className="title-ice block text-[1.35rem] tracking-wide">ADVENT CALENDAR</span>
              </h1>
              <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-foreground/85">24 days of gifts, spins &amp; BFG</p>
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-gold">Play · Collect · Win</p>
            </div>
          </header>

          {/* Streak */}
          <section aria-label="Streak" className="relative mt-5 rounded-2xl p-[2px]" style={{ background: "linear-gradient(145deg, oklch(0.9 0.1 90), oklch(0.5 0.1 60), oklch(0.85 0.12 85))" }}>
            <span className="snow-crest" />
            <div className="rounded-[14px] px-4 py-3.5" style={{ background: "linear-gradient(180deg, oklch(0.26 0.08 255), oklch(0.15 0.05 258))", boxShadow: "inset 0 0 18px oklch(0 0 0 / 0.6)" }}>
              <div className="flex items-center gap-3">
                <span className="grid size-11 shrink-0 place-items-center rounded-full border border-gold/60 bg-night text-xl shadow-[0_0_14px_-2px_var(--gold)]">🔥</span>
                <div className="min-w-0">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Streak</p>
                  <p className="font-serif text-xl font-black text-gold-gradient">{streak} {streak === 1 ? "DAY" : "DAYS"}</p>
                </div>
                <p className="ml-auto shrink-0 text-right text-[10px] uppercase tracking-widest text-muted-foreground">{status?.days.filter((d) => d.opened).length ?? 0}/24<br />opened</p>
              </div>
              <div className="relative mb-3 mt-3 h-3 rounded-full border border-ice/30 bg-night shadow-[inset_0_2px_4px_black]">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${(streak / 24) * 100}%`, background: "linear-gradient(180deg, oklch(0.97 0.1 95), var(--gold) 50%, oklch(0.65 0.14 62))", boxShadow: "0 0 12px var(--gold)" }} />
                {MILESTONES.map((m) => (
                  <span key={m} className={`absolute top-1/2 -translate-x-1/2 -translate-y-1/2 text-lg leading-none ${streak >= m ? "text-gold drop-shadow-[0_0_6px_var(--gold)]" : "text-muted-foreground/60"}`} style={{ left: `${(m / 24) * 100}%` }}>
                    {m === 24 ? "🎁" : "★"}
                  </span>
                ))}
              </div>
              <p className="text-[11px] text-muted-foreground">Keep the streak to day 24 to unlock the <span className="text-gold">Legendary Christmas BFG Box</span>.</p>
            </div>
          </section>

          {/* Grid */}
          <section aria-label="Calendar" className="mt-7 grid grid-cols-4 gap-x-2.5 gap-y-4">
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
