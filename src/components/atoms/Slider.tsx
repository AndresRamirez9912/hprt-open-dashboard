import styles from "./Slider.module.scss";

interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  label: string;
  onChange: (value: number) => void;
}

/** Range input; the filled part of the track goes violet -> amber, as in the design. */
export function Slider({
  value,
  min,
  max,
  step = 1,
  label,
  onChange,
}: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <input
      type="range"
      className={styles.slider}
      min={min}
      max={max}
      step={step}
      value={value}
      aria-label={label}
      style={{ ["--fill" as string]: `${pct}%` }}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  );
}
