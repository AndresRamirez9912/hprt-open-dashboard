import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PageHeading } from "../../components/molecules/PageHeading";
import { ColorFilters } from "../../components/organisms/ColorFilters";
import { DateStampCard } from "../../components/organisms/DateStampCard";
import { LabCard } from "../../components/organisms/LabCard";
import { PhotoStage } from "../../components/organisms/PhotoStage";
import { PrintActions } from "../../components/organisms/PrintActions";
import { PrintOptions } from "../../components/organisms/PrintOptions";
import { RealPreviewDialog } from "../../components/organisms/RealPreviewDialog";
import { usePrinter } from "../../hooks/useBridge";
import { useEstimatedPrintSeconds } from "../../hooks/usePrint";
import { usePrintFile } from "../../hooks/usePrintFile";
import { modelFromName } from "../../lib/printers";
import { usePrintJob } from "../../state/PrintJob";
import { usePrintSettings } from "../../state/PrintSettings";
import styles from "./PrintPage.module.scss";

/** Web "Print lab": the stage on the left, the inspector (filters, lab, date, options) on the right. */
export function PrintPage() {
  const { t } = useTranslation();
  const settings = usePrintSettings();
  const printer = usePrinter();
  const job = usePrintJob();
  const buildFile = usePrintFile();
  const estimate = useEstimatedPrintSeconds(settings.copies);
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <>
      <PageHeading
        title={t("web.print.title")}
        chip={printer ? modelFromName(printer.info?.name).label : undefined}
        subtitle={t("web.print.subtitle")}
      />
      <div className={styles.workspace}>
        <PhotoStage />
        <aside className={styles.inspector}>
          <ColorFilters />
          <LabCard />
          <DateStampCard />
          <PrintOptions
            title={t("web.print.options")}
            copiesHint={t("web.print.passes")}
          />
          <PrintActions
            canPrint={Boolean(
              settings.photo && printer && !printer.reconnecting,
            )}
            hasPrinter={Boolean(printer)}
            busy={job.status === "pending"}
            onPrint={() => job.start(buildFile, settings.copies)}
            onPreview={() => setPreviewOpen(true)}
            label={t("web.print.printNow", { count: settings.copies })}
            badge={
              estimate === null ? null : (
                <span title={t("web.print.estimateHint")}>
                  {t("web.print.estimate", { seconds: estimate })}
                </span>
              )
            }
          />
        </aside>
      </div>
      <RealPreviewDialog
        open={previewOpen}
        buildFile={buildFile}
        onClose={() => setPreviewOpen(false)}
      />
    </>
  );
}
