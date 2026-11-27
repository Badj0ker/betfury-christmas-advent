import bfg from "@/assets/bfg-token.png.asset.json";
import promo from "@/assets/promo-ticket.png.asset.json";
import fs from "@/assets/free-spin.png.asset.json";
import box from "@/assets/bfg-box.png.asset.json";
import type { Rarity, RewardType } from "@/lib/advent-api";

export const rewardImage: Record<RewardType, string> = {
  bfg: bfg.url,
  promo: promo.url,
  freespin: fs.url,
  box: box.url,
};

export const rarityClass: Record<Rarity, string> = {
  Common: "text-rarity-common border-rarity-common",
  Rare: "text-rarity-rare border-rarity-rare",
  Epic: "text-rarity-epic border-rarity-epic",
  Legendary: "text-rarity-legendary border-rarity-legendary",
};

export const rarityGlow: Record<Rarity, string> = {
  Common: "var(--rarity-common)",
  Rare: "var(--rarity-rare)",
  Epic: "var(--rarity-epic)",
  Legendary: "var(--rarity-legendary)",
};
