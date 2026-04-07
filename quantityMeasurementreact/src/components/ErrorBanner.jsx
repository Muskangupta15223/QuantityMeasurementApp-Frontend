import { useMeasurement, ACTIONS } from "../context/MeasurementContext";
import styles from "./ErrorBanner.module.css";

export default function ErrorBanner() {
  const { state, dispatch } = useMeasurement();

  if (!state.error) return null;

  return (
    <div className={styles.banner} role="alert">
      <span className={styles.icon}>⚠</span>
      <span className={styles.message}>{state.error}</span>
      <button
        className={styles.close}
        onClick={() => dispatch({ type: ACTIONS.SET_ERROR, payload: null })}
        aria-label="Dismiss error"
      >
        ×
      </button>
    </div>
  );
}
