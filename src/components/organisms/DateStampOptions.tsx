import { useTranslation } from "react-i18next";
import { DATE_FORMATS, formatStampDate } from "../../lib/exif";
import { stampDate, stampText } from "../../state/pageOptions";
import { usePrintSettings } from "../../state/PrintSettings";
import { Select } from "../atoms/Select";
import { TextField } from "../atoms/TextField";
import { ColorChooser } from "../molecules/ColorChooser";
import styles from "./DateStampOptions.module.scss";

/** Date -> "yyyy-mm-dd" (local time), the value of a date input. */
const toInputValue = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

/** "yyyy-mm-dd" -> local Date at noon (no time-zone shift), or null while the field is incomplete. */
function fromInputValue(value: string): Date | null {
  const m = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]), 12) : null;
}

/** Date (typed or picked), format and ink color of the stamp, plus where the date comes from. */
export function DateStampOptions({ colorLabel }: { colorLabel?: string }) {
  const { t, i18n } = useTranslation();
  const s = usePrintSettings();
  const sample = stampDate(s) ?? new Date();
  const color = colorLabel ?? t("print.stamp.color");

  return (
    <>
      <div
        className={`${styles.options} ${s.stampEnabled ? "" : styles.dimmed}`}
      >
        <label className={styles.field}>
          <span>{t("print.stamp.date")}</span>
          <TextField
            type="date"
            value={toInputValue(sample)}
            disabled={!s.stampEnabled}
            onChange={(e) => {
              const date = fromInputValue(e.target.value);
              if (date) s.setStampDate(date);
            }}
          />
        </label>
        <label className={styles.field}>
          <span>{t("print.stamp.format")}</span>
          <Select
            value={s.stampFormat}
            disabled={!s.stampEnabled}
            onChange={(e) =>
              s.setStampFormat(e.target.value as typeof s.stampFormat)
            }
          >
            {DATE_FORMATS.map((f) => (
              <option key={f} value={f}>
                {formatStampDate(sample, f, i18n.language)}
              </option>
            ))}
          </Select>
        </label>
        <div className={styles.field}>
          <span>{color}</span>
          <ColorChooser
            label={color}
            value={s.stampColor}
            presets={[
              {
                value: "white",
                label: t("print.stamp.white"),
                tone: "primary",
              },
              { value: "gold", label: t("print.stamp.gold"), tone: "gold" },
            ]}
            customLabel={t("print.stamp.custom")}
            customTitle={t("print.stamp.customTitle")}
            customColor={s.customColor}
            onPreset={s.setStampColor}
            onCustom={s.setCustomColor}
          />
        </div>
      </div>

      {s.stampEnabled && s.photo && (
        <p className={styles.source}>
          {s.stampDate
            ? t("print.stamp.manual")
            : s.photo.dateFromExif
              ? t("print.stamp.fromExif")
              : t("print.stamp.fromFile")}
          : <b>{stampText(s, i18n.language)}</b>
          {s.stampDate && (
            <button
              type="button"
              className={styles.restore}
              onClick={() => s.setStampDate(null)}
            >
              {t("print.stamp.restore")}
            </button>
          )}
        </p>
      )}
    </>
  );
}
