import styles from "./StatusDot.module.scss";

/** Live status dot; `ping` adds the expanding ring of the design. */
export function StatusDot({
  tone = "success",
  ping = false,
}: {
  tone?: "success" | "warning" | "error";
  ping?: boolean;
}) {
  return (
    <span className={`${styles.dot} ${styles[tone]}`} aria-hidden="true">
      {ping && <span className={styles.ping} />}
    </span>
  );
}
