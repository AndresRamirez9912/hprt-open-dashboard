// State of the protocol console: pause (snapshot), clear, category filter and download.
import { useState } from "react";
import { logFileText, type ClassifiedLog, type LogFilter } from "../lib/logs";
import { useLogEntries } from "./useLogEntries";

function download(entries: ClassifiedLog[]) {
  const url = URL.createObjectURL(
    new Blob([logFileText(entries)], { type: "text/plain" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = `photoprint-${new Date().toISOString().replace(/[:.]/g, "-")}.log`;
  a.click();
  URL.revokeObjectURL(url);
}

export function useLogConsole() {
  const live = useLogEntries();
  // Paused: the console keeps showing the lines it had when paused.
  const [snapshot, setSnapshot] = useState<ClassifiedLog[] | null>(null);
  // "Clear" hides the lines up to now; the bridge keeps its own history.
  const [clearedAt, setClearedAt] = useState(0);
  const [filter, setFilter] = useState<LogFilter>("all");

  const entries = (snapshot ?? live).filter((e) => e.t > clearedAt);
  return {
    /** Lines after the last "clear" (all categories). */
    entries,
    /** Lines of the selected category. */
    shown:
      filter === "all" ? entries : entries.filter((e) => e.category === filter),
    filter,
    setFilter,
    paused: snapshot !== null,
    togglePause: () => setSnapshot(snapshot ? null : live),
    clear: () => {
      setClearedAt(Date.now());
      setSnapshot(null);
    },
    download: () => download(entries),
  };
}
