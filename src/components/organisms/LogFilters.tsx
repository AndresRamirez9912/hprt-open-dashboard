import { useTranslation } from "react-i18next";
import type { ClassifiedLog, LogFilter } from "../../lib/logs";
import { FilterChip } from "../molecules/FilterChip";
import styles from "./LogFilters.module.scss";

const FILTERS = [
  { id: "all", dot: undefined },
  { id: "commands", dot: "primary" },
  { id: "network", dot: "success" },
  { id: "alerts", dot: "warning" },
  { id: "bluetooth", dot: "violet" },
] as const;

interface LogFiltersProps {
  entries: ClassifiedLog[];
  value: LogFilter;
  onChange: (filter: LogFilter) => void;
}

/** Category chips with their counts (horizontal scroll on mobile). */
export function LogFilters({ entries, value, onChange }: LogFiltersProps) {
  const { t } = useTranslation();
  const count = (id: LogFilter) =>
    id === "all"
      ? entries.length
      : entries.filter((e) => e.category === id).length;

  return (
    <nav className={styles.filters} aria-label={t("logs.console")}>
      {FILTERS.map((f) => (
        <FilterChip
          key={f.id}
          active={value === f.id}
          dot={f.dot}
          onClick={() => onChange(f.id)}
        >
          {t(`logs.filters.${f.id}`, { count: count(f.id) })}
        </FilterChip>
      ))}
    </nav>
  );
}
