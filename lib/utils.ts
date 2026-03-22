import { formatDistanceToNow } from "date-fns";
import type { SimulationCategory } from "./types";

const HTML_FENCE = /```html\n([\s\S]*?)```/;

export function extractHtmlFromStream(text: string): string {
  const match = text.match(HTML_FENCE);
  if (match) return match[1].trim();
  return text.trim();
}

export function inferCategory(prompt: string): SimulationCategory {
  const p = prompt.toLowerCase();
  if (
    /pendulum|gravity|wave|orbit|velocity|momentum|collision|force|spring|projectile/.test(
      p
    )
  ) {
    return "Physics";
  }
  if (
    /sort|algorithm|search|graph|tree|heap|queue|stack|complexity|binary/.test(p)
  ) {
    return "CS";
  }
  if (
    /epidemic|population|evolution|predator|prey|sir|lotka|volterra|gene|cell/.test(
      p
    )
  ) {
    return "Biology";
  }
  if (/interest|loan|portfolio|mortgage|compound|dividend|stock|bond/.test(p)) {
    return "Finance";
  }
  return "Math";
}

export function relativeTime(date: Date | string | number): string {
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function truncate(str: string, max: number): string {
  if (str.length <= max) return str;
  return str.slice(0, max - 1) + "…";
}
