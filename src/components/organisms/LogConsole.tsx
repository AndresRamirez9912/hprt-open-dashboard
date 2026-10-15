import { useTranslation } from "react-i18next";
import type { ClassifiedLog } from "../../lib/logs";
import { Card } from "../atoms/Card";
import { Icon } from "../atoms/Icon";
import { StatusDot } from "../atoms/StatusDot";
import { LogEntryItem } from "../molecules/LogEntryItem";
import styles from "./LogConsole.module.scss";

interface LogConsoleProps {
  entries: ClassifiedLog[];
  paused: boolean;
}

/** Raw protocol lines, newest first. */
export function LogConsole({ entries, paused }: LogConsoleProps) {
  const { t, i18n } = useTranslation();
  const time = (ms: number) =>
    new Date(ms).toLocaleTimeString(i18n.language, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

  return (
    <Card>
      <header className={styles.header}>
        <Icon name="terminal" />
        <h2>{t("logs.console")}</h2>
        <span className={`${styles.live} ${paused ? styles.paused : ""}`}>
          {!paused && <StatusDot ping />}
          {paused ? t("logs.paused") : t("logs.live")}
        </span>
      </header>
      {entries.length === 0 ? (
        <p className={styles.empty}>{t("logs.empty")}</p>
      ) : (
        <ol className={styles.list}>
          {[...entries].reverse().map((e, i) => (
            <LogEntryItem
              key={`${e.t}-${i}`}
              time={time(e.t)}
              category={e.category}
              tag={t(`logs.tags.${e.category}`)}
              message={e.msg}
            />
          ))}
        </ol>
      )}
    </Card>
  );
}
