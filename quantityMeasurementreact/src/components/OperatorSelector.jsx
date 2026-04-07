import { useMeasurement } from "../context/MeasurementContext";
import styles from "./OperatorSelector.module.css";

const MODE_SYMBOLS = { convert: "→", compare: "≟" };

export default function OperatorSelector() {
  const { state } = useMeasurement();
  const { selectedMode, arithmeticOp } = state;

  const symbol =
    selectedMode.id === "arithmetic"
      ? arithmeticOp.symbol
      : MODE_SYMBOLS[selectedMode.id] ?? "→";

  return (
    <div className={styles.center}>
      <div className={styles.symbol}>{symbol}</div>
    </div>
  );
}
