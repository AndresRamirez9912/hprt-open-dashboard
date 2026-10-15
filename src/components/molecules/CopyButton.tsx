import { useState } from "react";
import { Icon } from "../atoms/Icon";
import styles from "./CopyButton.module.scss";

interface CopyButtonProps {
  text: string;
  label: string;
  copiedLabel: string;
}

/** Small icon button that copies `text` to the clipboard and confirms for a moment. */
export function CopyButton({ text, label, copiedLabel }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button
      type="button"
      className={styles.button}
      aria-label={copied ? copiedLabel : label}
      title={copied ? copiedLabel : label}
      onClick={() => void copy()}
    >
      <Icon name={copied ? "check" : "content_copy"} size={16} />
    </button>
  );
}
