// src/components/ResultDisplay.jsx
// Renders result from context. Applies highlight animation on change.
// result is a QuantityMeasurementDTO from the backend:
//   { resultValue, resultString, operation, thisUnit, thatUnit, isError, errorMessage }

import { useEffect, useRef, useState } from 'react';
import { useMeasurement } from '../context/MeasurementContext.jsx';
import styles from './ResultDisplay.module.css';

function formatResult(result) {
  if (!result) return null;

  // Jackson serializes boolean `isError` field as `error` (strips the `is` prefix)
  const hasError = result.error === true || result.isError === true;
  if (hasError) return { type: 'error', text: result.errorMessage || 'An error occurred.' };

  const op = result.operation;

  if (op === 'compare') {
    // resultString is "true" or "false" — make it human-readable
    const equal = result.resultString === 'true';
    return {
      type: 'compare',
      text: equal
        ? `${result.thisValue} ${result.thisUnit} = ${result.thatValue} ${result.thatUnit}`
        : `${result.thisValue} ${result.thisUnit} ≠ ${result.thatValue} ${result.thatUnit}`,
      badge: equal ? 'Equal' : 'Not Equal',
      badgeType: equal ? 'success' : 'warning',
    };
  }

  if (op === 'convert') {
    const val = typeof result.resultValue === 'number'
      ? parseFloat(result.resultValue.toPrecision(8)).toString()
      : result.resultValue;
    return {
      type: 'convert',
      value: val,
      unit: result.thatUnit,
      sub: `${result.thisValue} ${result.thisUnit} → ${val} ${result.thatUnit}`,
    };
  }

  // Arithmetic: add / subtract / divide
  const opSymbols = { add: '+', subtract: '−', divide: '÷' };
  const val = typeof result.resultValue === 'number'
    ? parseFloat(result.resultValue.toPrecision(8)).toString()
    : result.resultValue;
  return {
    type: 'arithmetic',
    value: val,
    unit: result.thisUnit,
    sub: `${result.thisValue} ${result.thisUnit} ${opSymbols[op] || op} ${result.thatValue} ${result.thatUnit}`,
  };
}

export default function ResultDisplay() {
  const { state } = useMeasurement();
  const { result } = state;
  const [highlight, setHighlight] = useState(false);
  const prevResult = useRef(null);

  useEffect(() => {
    if (result && result !== prevResult.current) {
      setHighlight(true);
      const t = setTimeout(() => setHighlight(false), 600);
      prevResult.current = result;
      return () => clearTimeout(t);
    }
  }, [result]);

  if (!result) {
    return (
      <div className={styles.placeholder}>
        <span className={styles.placeholderIcon}>🔢</span>
        <p>Enter values and select units to calculate</p>
      </div>
    );
  }

  const formatted = formatResult(result);
  if (!formatted) return null;

  if (formatted.type === 'error') {
    return (
      <div className={`${styles.box} ${styles.errorBox}`}>
        <p className={styles.errorText}>⚠ {formatted.text}</p>
      </div>
    );
  }

  if (formatted.type === 'compare') {
    return (
      <div className={`${styles.box} ${styles.successBox} ${highlight ? styles.highlight : ''}`}>
        <p className={styles.resultLabel}>Result</p>
        <p className={styles.compareText}>{formatted.text}</p>
        <span className={`${styles.badge} ${styles[formatted.badgeType]}`}>{formatted.badge}</span>
      </div>
    );
  }

  return (
    <div className={`${styles.box} ${styles.successBox} ${highlight ? styles.highlight : ''}`}>
      <p className={styles.resultLabel}>Result</p>
      <div className={styles.resultRow}>
        <span className={styles.resultValue}>{formatted.value}</span>
        <span className={styles.resultUnit}>{formatted.unit}</span>
      </div>
      <p className={styles.resultSub}>{formatted.sub}</p>
    </div>
  );
}
