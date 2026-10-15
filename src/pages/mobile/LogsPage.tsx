import { LogConsole } from "../../components/organisms/LogConsole";
import { LogFilters } from "../../components/organisms/LogFilters";
import { LogStreamCard } from "../../components/organisms/LogStreamCard";
import { useLogConsole } from "../../hooks/useLogConsole";
import styles from "./LogsPage.module.scss";

/** Protocol log: live console with pause, clear, download and category filters. */
export function LogsPage() {
  const log = useLogConsole();
  return (
    <div className={styles.page}>
      <div className={styles.side}>
        <LogStreamCard
          entries={log.entries}
          paused={log.paused}
          onTogglePause={log.togglePause}
          onClear={log.clear}
          onDownload={log.download}
        />
        <LogFilters
          entries={log.entries}
          value={log.filter}
          onChange={log.setFilter}
        />
      </div>
      <LogConsole entries={log.shown} paused={log.paused} />
    </div>
  );
}
