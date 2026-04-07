import { useMeasurement, ACTIONS } from "../context/MeasurementContext";
import { MEASUREMENT_TYPES } from "../utils/constants";
import styles from "./TypeSelector.module.css";

export default function TypeSelector() {
  const { state, dispatch } = useMeasurement();

  const handleSelect = (type) => {
    dispatch({ type: ACTIONS.SET_TYPE, payload: type });
  };

  return (
    <div>
      <p className={styles.label}>MEASUREMENT TYPE</p>
      <div className={styles.grid}>
        {MEASUREMENT_TYPES.map((t) => (
          <button
            key={t.id}
            className={`${styles.card} ${state.selectedType.id === t.id ? styles.selected : ""}`}
            onClick={() => handleSelect(t)}
            aria-pressed={state.selectedType.id === t.id}
          >
            <span className={styles.icon}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
