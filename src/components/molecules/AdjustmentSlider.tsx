import { Icon } from "../atoms/Icon";
import { Slider } from "../atoms/Slider";
import styles from "./AdjustmentSlider.module.scss";

interface AdjustmentSliderProps {
  icon: string;
  label: string;
  value: number;
  onChange: (value: number) => void;
}

/** Labelled -50..+50 lab slider with its signed value. */
export function AdjustmentSlider({
  icon,
  label,
  value,
  onChange,
}: AdjustmentSliderProps) {
  return (
    <div className={styles.row}>
      <div className={styles.head}>
        <span className={styles.label}>
          <Icon name={icon} size={16} className={styles.icon} />
          {label}
        </span>
        <span className={`${styles.value} tabular`}>
          {value > 0 ? `+${value}` : value}
        </span>
      </div>
      <Slider
        value={value}
        min={-50}
        max={50}
        label={label}
        onChange={onChange}
      />
    </div>
  );
}
