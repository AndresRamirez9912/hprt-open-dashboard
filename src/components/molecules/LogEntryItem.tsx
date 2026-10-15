import styles from "./LogEntryItem.module.scss";

export type LogCategory =
  "commands" | "network" | "alerts" | "bluetooth" | "other";

interface LogEntryItemProps {
  time: string;
  category: LogCategory;
  tag: string;
  message: string;
  /** Terminal look (desktop console). */
  dark?: boolean;
}

/** One protocol log line: time, category tag and the raw line. */
export function LogEntryItem({
  time,
  category,
  tag,
  message,
  dark = false,
}: LogEntryItemProps) {
  return (
    <li className={`${styles.entry} ${dark ? styles.dark : ""}`}>
      <div className={styles.head}>
        <span className={styles.time}>[{time}]</span>
        <span className={`${styles.tag} ${styles[category]}`}>{tag}</span>
      </div>
      <code className={styles.message}>{message}</code>
    </li>
  );
}
