import { useEffect, useRef, type ReactNode } from "react";
import styles from "./Dialog.module.scss";

interface DialogProps {
  open: boolean;
  /** Called on Escape or backdrop click; omit to make the dialog non-dismissable. */
  onClose?: () => void;
  label: string;
  children: ReactNode;
}

/** Modal bottom sheet on mobile, centered card on larger screens. Uses the native <dialog>. */
export function Dialog({ open, onClose, label, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={label}
      className={styles.dialog}
      onCancel={(e) => {
        e.preventDefault();
        onClose?.();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose?.();
      }}
    >
      <div className={styles.sheet}>{children}</div>
    </dialog>
  );
}
