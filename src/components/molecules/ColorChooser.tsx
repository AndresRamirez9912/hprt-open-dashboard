import { Icon } from "../atoms/Icon";
import styles from "./ColorChooser.module.scss";

interface ColorChooserProps<T extends string> {
  label: string;
  presets: { value: T; label: string; tone: "primary" | "gold" }[];
  value: T | "custom";
  customLabel: string;
  customTitle: string;
  customColor: string;
  onPreset: (value: T) => void;
  onCustom: (hex: string) => void;
}

/** White / Gold / Custom pill selector of the date stamp color. */
export function ColorChooser<T extends string>(p: ColorChooserProps<T>) {
  return (
    <div className={styles.group} role="radiogroup" aria-label={p.label}>
      {p.presets.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={p.value === o.value}
          className={`${styles.option} ${p.value === o.value ? styles[o.tone] : ""}`}
          onClick={() => p.onPreset(o.value)}
        >
          {o.label}
        </button>
      ))}
      <label
        className={`${styles.option} ${styles.custom} ${p.value === "custom" ? styles.customOn : ""}`}
        title={p.customTitle}
      >
        <Icon name="palette" size={16} className={styles.palette} />
        <span>{p.customLabel}</span>
        {p.value === "custom" && (
          <span
            className={styles.swatch}
            style={{ background: p.customColor }}
          />
        )}
        <input
          type="color"
          value={p.customColor}
          aria-label={p.customTitle}
          onChange={(e) => p.onCustom(e.target.value)}
        />
      </label>
    </div>
  );
}
