import { describe, expect, it } from "vitest";
import { computeStreak, dayState, mockRewardFor, type CalendarDay } from "@/lib/advent-api";

const days = (opened: number[]): CalendarDay[] =>
  Array.from({ length: 24 }, (_, i) => ({ id: i + 1, opened: opened.includes(i + 1), claimed: false, reward: null }));

describe("advent rules", () => {
  it("streak counts consecutive opened days up to today", () => {
    expect(computeStreak(days([1, 2, 3, 5]), 5)).toBe(1);
    expect(computeStreak(days([1, 2, 3]), 4)).toBe(3);
    expect(computeStreak(days([1, 3]), 5)).toBe(0);
  });
  it("day 24 is the legendary box", () => {
    expect(mockRewardFor(24)).toMatchObject({ type: "box", rarity: "Legendary" });
  });
  it("day states", () => {
    const d = days([2]);
    expect(dayState(d[1]!, 5)).toBe("opened");
    expect(dayState(d[4]!, 5)).toBe("today");
    expect(dayState(d[9]!, 5)).toBe("locked");
  });
});
