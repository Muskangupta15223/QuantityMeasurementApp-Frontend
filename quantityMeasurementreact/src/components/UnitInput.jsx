import { formatUnit } from "../utils/constants";
import styles from "./UnitInput.module.css";

/**
 * Reusable input: numeric value + unit dropdown.
 * Pass readOnly=true for the "TO" side of a convert result.
 */
export default function UnitInput({
  label,
  value,
  unit,
  units = [],
  onValueChange,
  onUnitChange,
  readOnly = false,
  placeholder = "Result here",
}) {
  return (
    <div className={styles.wrapper}>
      {label && <span className={styles.label}>{label}</span>}

      {readOnly ? (
        <div className={styles.valuePlaceholder}>{placeholder}</div>
      ) : (
        <input
          type="number"
          className={styles.valueInput}
          value={value}
          onChange={(e) => onValueChange?.(e.target.value)}
          placeholder="0"
        />
      )}

      <select
        className={styles.unitSelect}
        value={unit}
        onChange={(e) => onUnitChange?.(e.target.value)}
      >
        {units.map((u) => (
          <option key={u} value={u}>
            {formatUnit(u)}
          </option>
        ))}
      </select>
    </div>
  );
}
