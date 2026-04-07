import { useMeasurement, ACTIONS } from "../context/MeasurementContext";
import { MODES } from "../utils/constants";
import styles from "./ActionSelector.module.css";

export default function ActionSelector() {
  const { state, dispatch } = useMeasurement();
  return (
    <div>
      <p className={styles.label}>CHOOSE ACTION</p>
      <div className={styles.tabBar} role="tablist">
        {MODES.map((m) => (
          <button
            key={m.id}
            role="tab"
            aria-selected={state.selectedMode.id === m.id}
            className={`${styles.tab} ${state.selectedMode.id === m.id ? styles.active : ""}`}
            onClick={() => dispatch({ type: ACTIONS.SET_MODE, payload: m })}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  );
}
