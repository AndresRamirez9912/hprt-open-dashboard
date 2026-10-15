import { LogFilters } from "../../components/organisms/LogFilters";
import { LogsHeader } from "../../components/organisms/LogsHeader";
import { TerminalConsole } from "../../components/organisms/TerminalConsole";
import { useLogConsole } from "../../hooks/useLogConsole";

/** Web protocol log: header with figures and actions, filters and the terminal console. */
export function LogsPage() {
  const log = useLogConsole();
  return (
    <>
      <LogsHeader
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
      <TerminalConsole entries={log.shown} paused={log.paused} />
    </>
  );
}
