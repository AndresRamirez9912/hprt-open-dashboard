import { useState } from "react";
import { LabAdjustments } from "../../components/organisms/LabAdjustments";
import { PhotoCanvas } from "../../components/organisms/PhotoCanvas";
import { PrintActions } from "../../components/organisms/PrintActions";
import { PrinterQuickBar } from "../../components/organisms/PrinterQuickBar";
import { PrintOptions } from "../../components/organisms/PrintOptions";
import { RealPreviewDialog } from "../../components/organisms/RealPreviewDialog";
import { usePrinter } from "../../hooks/useBridge";
import { usePrintFile } from "../../hooks/usePrintFile";
import { usePrintJob } from "../../state/PrintJob";
import { usePrintSettings } from "../../state/PrintSettings";
import styles from "./PrintPage.module.scss";

/** Mobile editor: printer bar, photo on the canvas, adjustments, options and the print action. */
export function PrintPage() {
  const settings = usePrintSettings();
  const printer = usePrinter();
  const job = usePrintJob();
  const buildFile = usePrintFile();
  const [previewOpen, setPreviewOpen] = useState(false);

  return (
    <div className={styles.page}>
      <div className={styles.left}>
        <PrinterQuickBar />
      </div>
      <div className={styles.center}>
        <PhotoCanvas />
      </div>
      <div className={styles.right}>
        <LabAdjustments />
        <PrintOptions />
        <PrintActions
          canPrint={Boolean(settings.photo && printer && !printer.reconnecting)}
          hasPrinter={Boolean(printer)}
          busy={job.status === "pending"}
          onPrint={() => job.start(buildFile, settings.copies)}
          onPreview={() => setPreviewOpen(true)}
        />
      </div>
      <RealPreviewDialog
        open={previewOpen}
        buildFile={buildFile}
        onClose={() => setPreviewOpen(false)}
      />
    </div>
  );
}
