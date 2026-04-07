import { MEASUREMENT_TYPES, formatUnit, formatValue } from "../utils/constants";
import styles from "./HistoryList.module.css";

const OP_SYMBOLS = {
  convert:  "→",
  compare:  "≟",
  add:      "+",
  subtract: "−",
  divide:   "÷",
};

function getTypeIcon(measurementType) {
  return MEASUREMENT_TYPES.find((t) => t.id === measurementType)?.icon ?? "📐";
}

function HistoryRow({ record }) {
  const {
    operation, error,
    thisValue, thisUnit, thisMeasurementType,
    thatValue, thatUnit,
    resultValue, resultString,
  } = record;

  const symbol    = OP_SYMBOLS[operation] ?? "→";
  const isNumeric = resultValue !== null && resultValue !== undefined;
  const isEqual   = resultString === "true";
  const isBoolean = resultString !== null && resultString !== undefined;

  return (
    <div className={styles.row}>
      {/* Icon */}
      <div className={`${styles.iconBox} ${error ? styles.iconError : styles.iconOk}`}>
        {getTypeIcon(thisMeasurementType)}
      </div>

      {/* Meta */}
      <div className={styles.meta}>
        <div className={styles.expression}>
          <span>{thisValue} {formatUnit(thisUnit)}</span>
          <span className={styles.opSymbol}>{symbol}</span>
          {thatValue !== undefined && thatValue !== null && (
            <span>{thatValue} {formatUnit(thatUnit)}</span>
          )}
        </div>
        <div className={styles.sub}>
          {MEASUREMENT_TYPES.find((t) => t.id === thisMeasurementType)?.label ?? thisMeasurementType}
        </div>
      </div>

      {/* Result */}
      <div className={styles.right}>
        {error ? (
          <span className={`${styles.tag} ${styles.tagError}`}>Error</span>
        ) : isNumeric ? (
          <>
            <div className={styles.resultVal}>{formatValue(resultValue, 4)}</div>
            <div className={styles.resultUnit}>{formatUnit(thatUnit)}</div>
          </>
        ) : isBoolean ? (
          <span className={`${styles.tag} ${isEqual ? styles.tagEqual : styles.tagError}`}>
            {isEqual ? "Equal" : "Not Equal"}
          </span>
        ) : null}

        {!error && (
          <div>
            <span className={`${styles.tag} ${styles.tagOp}`}>{operation}</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function HistoryList({ history, loading }) {
  if (loading) {
    return (
      <div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={styles.skeletonRow} style={{ animationDelay: `${i * 0.08}s` }} />
        ))}
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>📭</div>
        <div className={styles.emptyTitle}>No records found</div>
        <p className={styles.emptySub}>Try a different filter or make some calculations first.</p>
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {history.map((record, i) => (
        <HistoryRow key={record.id ?? i} record={record} />
      ))}
    </div>
  );
}
