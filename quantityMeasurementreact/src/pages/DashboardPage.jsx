import { useMeasurement, ACTIONS } from "../context/MeasurementContext";
import { useConversion }           from "../hooks/useConversion";
import { useToast }                from "../components/Toast";
import { ARITHMETIC_OPS }          from "../utils/constants";

import TypeSelector     from "../components/TypeSelector";
import ActionSelector   from "../components/ActionSelector";
import UnitInput        from "../components/UnitInput";
import OperatorSelector from "../components/OperatorSelector";
import ResultDisplay    from "../components/ResultDisplay";
import ErrorBanner      from "../components/ErrorBanner";

import styles from "./DashboardPage.module.css";

export default function DashboardPage({ user, token, onOpenAuth }) {
  const { state, dispatch } = useMeasurement();
  const { addToast }        = useToast();
  const { calculate, calculating } = useConversion(token);

  const { selectedType, selectedMode, arithmeticOp, fromValue, toValue, fromUnit, toUnit } = state;

  const handleCalculate = async () => {
    await calculate();
    if (user) addToast("Result saved to history ✓", "success");
  };

  const calcLabel = () => {
    if (selectedMode.id === "arithmetic") return `${arithmeticOp.label.split(" ")[0]} Values`;
    return `${selectedMode.label}`;
  };

  return (
    <main className={styles.page}>

      {/* ── Hero ──────────────────────────────────────────── */}
      <section className={styles.hero}>
        <div className={styles.heroBlob1} />
        <div className={styles.heroBlob2} />
        <div className={styles.heroInner}>
          <div className={styles.badgeRow}>
            <span className={`${styles.badge} ${styles.badgeAccent}`}>
              Quantity Measurement
            </span>
            {user && (
              <span className={`${styles.badge} ${styles.badgeTeal}`}>
                ✓ Signed In
              </span>
            )}
          </div>
          <h1 className={styles.heroTitle}>
            Measure Anything,{" "}
            <span className={styles.heroGradient}>Instantly</span>
          </h1>
          <p className={styles.heroSub}>
            Convert, compare and compute across length, weight, temperature and volume.
            {!user && " Sign in to save your history."}
          </p>
        </div>
      </section>

      {/* ── Calculator Card ───────────────────────────────── */}
      <div className={styles.card}>

        {/* Type */}
        <TypeSelector />
        <div className={styles.divider} />

        {/* Mode tabs */}
        <ActionSelector />
        <div className={styles.divider} />

        {/* ── CONVERSION: value + from-unit → to-unit ─────── */}
        {selectedMode.id === "convert" && (
          <div className={styles.convertRow}>
            <UnitInput
              label="VALUE"
              value={fromValue}
              unit={fromUnit}
              units={selectedType.units}
              onValueChange={(v) => dispatch({ type: ACTIONS.SET_FROM_VALUE, payload: v })}
              onUnitChange={(u)  => dispatch({ type: ACTIONS.SET_FROM_UNIT,  payload: u })}
            />
            <OperatorSelector />
            {/* Right side: only unit selector, no value input */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <span style={{
                fontSize: 11, color: "var(--text3)", fontWeight: 700,
                letterSpacing: "0.9px", fontFamily: "var(--font-head)"
              }}>
                TO UNIT
              </span>
              <select
                value={toUnit}
                onChange={(e) => dispatch({ type: ACTIONS.SET_TO_UNIT, payload: e.target.value })}
                style={{
                  background: "var(--surface2)", fontFamily: "var(--font-head)",
                  fontSize: 14, fontWeight: 600, color: "var(--text2)"
                }}
              >
                {selectedType.units.map((u) => (
                  <option key={u} value={u}>
                    {u.charAt(0) + u.slice(1).toLowerCase()}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* ── COMPARISON: value1 + unit1  vs  value2 + unit2 ── */}
        {selectedMode.id === "compare" && (
          <div className={styles.compareRow}>
            <UnitInput
              label="VALUE 1"
              value={fromValue}
              unit={fromUnit}
              units={selectedType.units}
              onValueChange={(v) => dispatch({ type: ACTIONS.SET_FROM_VALUE, payload: v })}
              onUnitChange={(u)  => dispatch({ type: ACTIONS.SET_FROM_UNIT,  payload: u })}
            />
            <OperatorSelector />
            <UnitInput
              label="VALUE 2"
              value={toValue}
              unit={toUnit}
              units={selectedType.units}
              onValueChange={(v) => dispatch({ type: ACTIONS.SET_TO_VALUE, payload: v })}
              onUnitChange={(u)  => dispatch({ type: ACTIONS.SET_TO_UNIT,  payload: u })}
            />
          </div>
        )}

        {/* ── ARITHMETIC: dropdown op + value1 + value2 ──────── */}
        {selectedMode.id === "arithmetic" && (
          <div className={styles.arithmeticSection}>
            {/* Operation dropdown */}
            <div className={styles.arithOpRow}>
              <span className={styles.arithOpLabel}>OPERATION</span>
              <select
                className={styles.arithOpSelect}
                value={arithmeticOp.id}
                onChange={(e) => {
                  const op = ARITHMETIC_OPS.find((o) => o.id === e.target.value);
                  dispatch({ type: ACTIONS.SET_ARITH_OP, payload: op });
                }}
              >
                {ARITHMETIC_OPS.map((op) => (
                  <option key={op.id} value={op.id}>{op.label}</option>
                ))}
              </select>
            </div>

            {/* Two value inputs */}
            <div className={styles.arithInputRow}>
              <UnitInput
                label="VALUE 1"
                value={fromValue}
                unit={fromUnit}
                units={selectedType.units}
                onValueChange={(v) => dispatch({ type: ACTIONS.SET_FROM_VALUE, payload: v })}
                onUnitChange={(u)  => dispatch({ type: ACTIONS.SET_FROM_UNIT,  payload: u })}
              />
              <OperatorSelector />
              <UnitInput
                label="VALUE 2"
                value={toValue}
                unit={toUnit}
                units={selectedType.units}
                onValueChange={(v) => dispatch({ type: ACTIONS.SET_TO_VALUE, payload: v })}
                onUnitChange={(u)  => dispatch({ type: ACTIONS.SET_TO_UNIT,  payload: u })}
              />
            </div>
          </div>
        )}

        {/* Error banner */}
        <ErrorBanner />

        <div className={styles.divider} />

        {/* Calculate */}
        <button
          className={styles.calcBtn}
          onClick={handleCalculate}
          disabled={calculating}
        >
          {calculating
            ? <><span className={styles.spinner} /> Calculating…</>
            : `${calcLabel()} — ${selectedType.label}`
          }
        </button>

        {/* Result */}
        <ResultDisplay />
      </div>

      {/* ── Guest CTA ─────────────────────────────────────── */}
      {!user && (
        <div className={styles.ctaBanner}>
          <div>
            <div className={styles.ctaTitle}>Track your calculations</div>
            <p className={styles.ctaSub}>Sign in to save results and browse your full history.</p>
          </div>
          <button className={styles.ctaBtn} onClick={() => onOpenAuth("register")}>
            Get Started →
          </button>
        </div>
      )}
    </main>
  );
}
