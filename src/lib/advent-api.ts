// Mock API layer for the BETFURY Advent Calendar.
// Replace the bodies of getCalendarStatus / openDay / claimReward with real backend calls.

export type RewardType = "bfg" | "promo" | "freespin" | "box";
export type Rarity = "Common" | "Rare" | "Epic" | "Legendary";
export type DayState = "opened" | "today" | "available" | "locked";

export interface Reward {
  type: RewardType;
  title: string;
  amount: string;
  rarity: Rarity;
}

export interface CalendarDay {
  id: number; // 1..24
  opened: boolean;
  claimed: boolean;
  reward: Reward | null; // only revealed after opening
}

export interface CalendarStatus {
  today: number; // 1..24 (December day)
  streak: number;
  days: CalendarDay[];
}

const STORAGE_KEY = "bf-advent-demo-v1";

// Deterministic mock reward table (backend decides in production).
export function mockRewardFor(day: number): Reward {
  if (day === 24) return { type: "box", title: "Christmas BFG Box", amount: "Mega Box", rarity: "Legendary" };
  if (day % 7 === 0) return { type: "box", title: "Christmas BFG Box", amount: "Gift Box", rarity: "Epic" };
  if (day % 5 === 0) return { type: "promo", title: "Promocode Ticket", amount: "+50% Bonus", rarity: "Epic" };
  if (day % 3 === 0) return { type: "freespin", title: "Free Spins", amount: `${10 + day} FS`, rarity: "Rare" };
  if (day % 2 === 0) return { type: "promo", title: "Promocode Ticket", amount: "+10% Bonus", rarity: "Common" };
  return { type: "bfg", title: "BFG Token", amount: `${day * 25} BFG`, rarity: day > 12 ? "Rare" : "Common" };
}

function load(): CalendarDay[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as CalendarDay[];
  } catch {
    /* ignore */
  }
  return Array.from({ length: 24 }, (_, i) => ({ id: i + 1, opened: false, claimed: false, reward: null }));
}

function save(days: CalendarDay[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(days));
}

// Streak = consecutive opened days ending at the most recent opened day <= today.
export function computeStreak(days: CalendarDay[], today: number): number {
  let start = today;
  if (!days[start - 1]?.opened) start -= 1;
  let streak = 0;
  for (let d = start; d >= 1; d--) {
    if (days[d - 1]?.opened) streak++;
    else break;
  }
  return streak;
}

export function dayState(day: CalendarDay, today: number): DayState {
  if (day.opened) return "opened";
  if (day.id === today) return "today";
  if (day.id < today) return "available";
  return "locked";
}

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** GET /api/advent/status */
export async function getCalendarStatus(today: number): Promise<CalendarStatus> {
  await delay(120);
  const days = load();
  return { today, streak: computeStreak(days, today), days };
}

/** POST /api/advent/open { dayId } */
export async function openDay(dayId: number): Promise<Reward> {
  await delay(350);
  const days = load();
  const day = days[dayId - 1];
  if (!day) throw new Error("Invalid day");
  const reward = day.reward ?? mockRewardFor(dayId);
  days[dayId - 1] = { ...day, opened: true, reward };
  save(days);
  return reward;
}

/** POST /api/advent/claim { dayId } */
export async function claimReward(dayId: number): Promise<{ ok: true }> {
  await delay(200);
  const days = load();
  const day = days[dayId - 1];
  if (day) {
    days[dayId - 1] = { ...day, claimed: true };
    save(days);
  }
  return { ok: true };
}

/** Demo only: wipe progress */
export async function resetCalendar(): Promise<void> {
  localStorage.removeItem(STORAGE_KEY);
}
