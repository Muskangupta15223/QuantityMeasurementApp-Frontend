// ============================================================
// conversion.js — Pure JS functions for:
//                 conversion, comparison, arithmetic logic
// ============================================================

// ── Evaluate formula string safely ─────────────────────────
/**
 * Safely evaluates a formula string from db.json.
 * The variable 'val' represents the input value.
 * @param {string} formula - e.g. "(val * 9/5) + 32"
 * @param {number} val
 * @returns {number}
 */
function evaluateFormula(formula, val) {
  // Only allow safe math characters
  if (!/^[\d\s\+\-\*\/\.\(\)val]+$/.test(formula)) {
    throw new Error('Unsafe formula: ' + formula);
  }
  return Function('"use strict"; const val = ' + val + '; return (' + formula + ');')();
}

// ── UC-09: Perform Conversion ───────────────────────────────
/**
 * Converts a value using a conversion record (factor or formula).
 * @param {number}        val        - numeric value to convert
 * @param {Object|null}   conversion - { factor, formula } from API
 * @returns {{ result: number, error: string|null }}
 */
function performConversion(val, conversion) {
  if (!conversion) {
    return { result: null, error: 'Conversion not available for this unit pair.' };
  }
  try {
    let result;
    if (conversion.formula) {
      result = evaluateFormula(conversion.formula, val);
    } else {
      result = val * conversion.factor;
    }
    return { result, error: null };
  } catch (e) {
    return { result: null, error: 'Calculation error: ' + e.message };
  }
}

// ── UC-10: Perform Comparison ───────────────────────────────
/**
 * Compares two values by converting both to a common base via
 * their conversion records.
 * @param {number} fromVal
 * @param {number} toVal
 * @param {Object|null} fromConv - conversion record: fromUnit → base
 * @param {Object|null} toConv   - conversion record: toUnit   → base
 * @returns {{ symbol: string, error: string|null }}
 *          symbol: '>' | '<' | '='
 */
function performComparison(fromVal, toVal, fromConv, toConv) {
  try {
    // Convert fromVal to base
    let fromBase;
    if (fromConv) {
      if (fromConv.formula) {
        fromBase = evaluateFormula(fromConv.formula, fromVal);
      } else {
        fromBase = fromVal * fromConv.factor;
      }
    } else {
      fromBase = fromVal; // same unit or unknown → compare directly
    }

    // Convert toVal to base
    let toBase;
    if (toConv) {
      if (toConv.formula) {
        toBase = evaluateFormula(toConv.formula, toVal);
      } else {
        toBase = toVal * toConv.factor;
      }
    } else {
      toBase = toVal;
    }

    let symbol;
    if (fromBase > toBase)      symbol = '>';
    else if (fromBase < toBase) symbol = '<';
    else                        symbol = '=';

    return { symbol, error: null };
  } catch (e) {
    return { symbol: null, error: 'Comparison error: ' + e.message };
  }
}

// ── UC-11: Perform Arithmetic ───────────────────────────────
/**
 * Normalises toValue into fromUnit, then applies the operator.
 * Result is expressed in fromUnit.
 * @param {number} fromVal
 * @param {number} toVal
 * @param {string} operator       - '+' | '-' | '*' | '/'
 * @param {Object|null} normConv  - conversion: toUnit → fromUnit
 * @returns {{ result: number|null, error: string|null }}
 */
function performArithmetic(fromVal, toVal, operator, normConv) {
  try {
    // Normalize toVal into fromUnit
    let normalizedTo;
    if (normConv && normConv.from !== normConv.to) {
      if (normConv.formula) {
        normalizedTo = evaluateFormula(normConv.formula, toVal);
      } else {
        normalizedTo = toVal * normConv.factor;
      }
    } else {
      normalizedTo = toVal; // same unit
    }

    // Division by zero guard (UC-11 exception flow)
    if (operator === '/' && normalizedTo === 0) {
      return { result: null, error: 'Cannot divide by zero.' };
    }

    let result;
    switch (operator) {
      case '+': result = fromVal + normalizedTo; break;
      case '-': result = fromVal - normalizedTo; break;
      case '*': result = fromVal * normalizedTo; break;
      case '/': result = fromVal / normalizedTo; break;
      default:  return { result: null, error: 'Unknown operator: ' + operator };
    }

    return { result, error: null };
  } catch (e) {
    return { result: null, error: 'Arithmetic error: ' + e.message };
  }
}

// ── UC-17: Validate User Input ──────────────────────────────
/**
 * Validates a numeric input value.
 * Negative values allowed (Temperature use case).
 * @param {string} raw - raw string from input field
 * @returns {{ valid: boolean, message: string }}
 */
function validateInput(raw) {
  if (raw === '' || raw === null || raw === undefined) {
    return { valid: false, message: 'This field is required.' };
  }
  const num = parseFloat(raw);
  if (isNaN(num) || !isFinite(num)) {
    return { valid: false, message: 'Please enter a valid number.' };
  }
  return { valid: true, message: '' };
}

// ── UC-12: Format result for display ───────────────────────
/**
 * Formats a numeric result to max 8 significant figures,
 * trimming trailing zeros.
 * @param {number} value
 * @returns {string}
 */
function formatResult(value) {
  if (value === null || value === undefined || isNaN(value)) return 'Invalid';
  if (!isFinite(value)) return 'Invalid';
  return parseFloat(value.toPrecision(8)).toString();
}
