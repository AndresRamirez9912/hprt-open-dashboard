import { Button } from "../atoms/Button";
import { Icon } from "../atoms/Icon";
import styles from "./FoundPrinterItem.module.scss";

interface FoundPrinterItemProps {
  name: string;
  detail: string;
  actionLabel: string;
  disabled?: boolean;
  onConnect: () => void;
}

export function FoundPrinterItem({
  name,
  detail,
  actionLabel,
  disabled,
  onConnect,
}: FoundPrinterItemProps) {
  return (
    <li className={styles.item}>
      <span className={styles.icon}>
        <Icon name="print" size={20} />
      </span>
      <span className={styles.text}>
        <strong>{name}</strong>
        <small>{detail}</small>
      </span>
      <Button variant="primary" small disabled={disabled} onClick={onConnect}>
        {actionLabel}
      </Button>
    </li>
  );
}
