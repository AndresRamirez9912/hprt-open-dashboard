// Overall progress of a print job in %: claim, sending (0-50 %), then each printing stage.
import type { JobEvent } from "../api/types";

export function jobProgress(job: JobEvent | null): number {
  if (!job) return 2;
  switch (job.phase) {
    case "claim":
      return 2;
    case "sending":
      return (job.progress ?? 0) / 2;
    case "sent":
      return 50;
    case "stage":
      return job.stageCode && job.stageCode <= 6
        ? 50 + job.stageCode * 7.5
        : 95;
    default:
      return 100;
  }
}
