import { useTranslation } from "react-i18next";
import { hrefFor } from "../../app/router";
import { useLogEntries } from "../../hooks/useLogEntries";
import { Icon } from "../atoms/Icon";
import styles from "./EventsRow.module.scss";

/** Desktop summary of the protocol log with a link to it. */
export function EventsRow() {
  const { t } = useTranslation();
  const entries = useLogEntries();
  const last = entries[entries.length - 1];

  return (
    <section className={styles.row}>
      <span className={styles.icon}>
        <Icon name="receipt_long" />
      </span>
      <div className={styles.text}>
        <div className={styles.title}>
          <h2>{t("web.connection.events")}</h2>
          <code>
            {t("web.connection.eventsCount", { count: entries.length })}
          </code>
        </div>
        <p>
          {last
            ? t("web.connection.lastEvent", {
                time: new Date(last.t).toLocaleTimeString(),
                msg: last.msg,
              })
            : t("web.connection.noEvents")}
        </p>
      </div>
      <a href={hrefFor("logs")} className={styles.link}>
        {t("web.connection.details")}
        <Icon name="arrow_forward" size={16} />
      </a>
    </section>
  );
}
