// Latency bands of the design: optimal < 500 ms, acceptable < 2000 ms, critical above.
export type LatencyRating = "optimal" | "acceptable" | "high";

export function latencyRating(avgMs: number | null | undefined): LatencyRating {
  if (avgMs == null || avgMs < 500) return "optimal";
  if (avgMs < 2000) return "acceptable";
  return "high";
}

/** Position of a latency on the 3-segment bar (segments 20% / 35% / 45%), in %. */
export function latencyBarPosition(avgMs: number): number {
  if (avgMs < 500) return (avgMs / 500) * 20;
  if (avgMs < 2000) return 20 + ((avgMs - 500) / 1500) * 35;
  return Math.min(100, 55 + ((avgMs - 2000) / 6000) * 45);
}
