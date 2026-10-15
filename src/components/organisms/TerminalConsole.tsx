import { useTranslation } from "react-i18next";
import type { ClassifiedLog } from "../../lib/logs";
import { LogEntryItem } from "../molecules/LogEntryItem";
import styles from "./TerminalConsole.module.scss";

interface TerminalConsoleProps {
  entries: ClassifiedLog[];
  paused: boolean;
}

/** Desktop event console: raw protocol lines, newest first, in a terminal window. */
export function TerminalConsole({ entries, paused }: TerminalConsoleProps) {
  const { t, i18n } = useTranslation();
  // hh:mm:ss.mmm, as in the design.
  const time = (ms: number) =>
    `${new Date(ms).toLocaleTimeString(i18n.language, { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })}.${String(ms % 1000).padStart(3, "0")}`;

  return (
    <section className={styles.terminal}>
      <header className={styles.bar}>
        <span className={styles.lights} aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <h2>{t("web.logs.console")}</h2>
        <span className={`${styles.live} ${paused ? styles.paused : ""}`}>
          <span className={styles.dot} />
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
              dark
              time={time(e.t)}
              category={e.category}
              tag={t(`logs.tags.${e.category}`)}
              message={e.msg}
            />
          ))}
        </ol>
      )}
    </section>
  );
}
