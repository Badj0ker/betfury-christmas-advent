type Impact = "light" | "medium" | "heavy" | "rigid" | "soft";
interface TgWebApp {
  ready: () => void;
  expand: () => void;
  HapticFeedback?: {
    impactOccurred: (s: Impact) => void;
    notificationOccurred: (s: "error" | "success" | "warning") => void;
  };
}
function tg(): TgWebApp | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as { Telegram?: { WebApp?: TgWebApp } }).Telegram?.WebApp;
}
export function initTelegram() {
  const w = tg();
  w?.ready();
  w?.expand();
}
export function haptic(kind: Impact | "success") {
  const h = tg()?.HapticFeedback;
  if (!h) return;
  if (kind === "success") h.notificationOccurred("success");
  else h.impactOccurred(kind);
}
