import styles from "./LatencyChart.module.scss";

interface LatencyChartProps {
  /** Round trips in ms, oldest first; null = heartbeat lost. */
  samples: (number | null)[];
  /** Points shown along the x axis. */
  slots: number;
  /** Dashed reference line (ms). */
  reference: number;
  label: string;
  lostLabel: string;
}

const W = 480;
const H = 96;
const PAD = 8;

/** Line of the last heartbeats; lost heartbeats are marked on the baseline. */
export function LatencyChart({
  samples,
  slots,
  reference,
  label,
  lostLabel,
}: LatencyChartProps) {
  const top = Math.max(reference * 1.5, ...samples.map((v) => v ?? 0)) * 1.1;
  const x = (i: number) => PAD + (i * (W - PAD * 2)) / Math.max(1, slots - 1);
  const y = (ms: number) => H - PAD - (ms / top) * (H - PAD * 2);
  // Right-aligned: the newest sample is always the last slot.
  const offset = slots - samples.length;
  const points = samples.map((v, i) => ({ v, cx: x(offset + i) }));
  const line = points
    .filter((p) => p.v !== null)
    .map((p) => `${p.cx},${y(p.v!)}`)
    .join(" ");

  return (
    <svg
      className={styles.chart}
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={label}
    >
      <line
        className={styles.reference}
        x1={PAD}
        x2={W - PAD}
        y1={y(reference)}
        y2={y(reference)}
      />
      {line && <polyline className={styles.line} points={line} />}
      {points.map((p, i) =>
        p.v === null ? (
          <text
            key={i}
            className={styles.lost}
            x={p.cx}
            y={H - 2}
            textAnchor="middle"
          >
            ×<title>{lostLabel}</title>
          </text>
        ) : (
          <circle key={i} className={styles.point} cx={p.cx} cy={y(p.v)} r={3}>
            <title>{`${p.v} ms`}</title>
          </circle>
        ),
      )}
    </svg>
  );
}
