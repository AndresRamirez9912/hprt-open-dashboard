import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../atoms/Button";
import { Dialog } from "../molecules/Dialog";
import styles from "./RealPreviewDialog.module.scss";

interface RealPreviewDialogProps {
  open: boolean;
  /** Builds the exact file that would be sent to the printer. */
  buildFile: () => Promise<Blob>;
  onClose: () => void;
}

/** Shows the exact JPEG the printer would receive (already rotated for the model). */
export function RealPreviewDialog({
  open,
  buildFile,
  onClose,
}: RealPreviewDialogProps) {
  const { t } = useTranslation();
  const [file, setFile] = useState<{ url: string; size: number } | null>(null);

  useEffect(() => {
    if (!open) return;
    let url = "";
    let cancelled = false;
    void buildFile().then((blob) => {
      if (cancelled) return;
      url = URL.createObjectURL(blob);
      setFile({ url, size: blob.size });
    });
    return () => {
      cancelled = true;
      if (url) URL.revokeObjectURL(url);
      setFile(null);
    };
    // Build once per opening; the editor cannot change while the dialog is open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} label={t("print.realPreviewTitle")}>
      <h4 className={styles.title}>{t("print.realPreviewTitle")}</h4>
      <div className={styles.frame}>
        {file && <img src={file.url} alt={t("print.realPreviewTitle")} />}
      </div>
      <p className={styles.hint}>
        {t("print.realPreviewHint")}
        {file && (
          <b className="tabular">
            {" "}
            · {(file.size / 1024 / 1024).toFixed(2)} MB
          </b>
        )}
      </p>
      <Button variant="primary" block onClick={onClose}>
        {t("print.close")}
      </Button>
    </Dialog>
  );
}
