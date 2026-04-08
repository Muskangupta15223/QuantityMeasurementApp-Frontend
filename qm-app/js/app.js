// ============================================================
// app.js — Entry point: DOMContentLoaded handler,
//          initialises all modules, wires event listeners.
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── DOM References ──────────────────────────────────────
  const typeCards     = document.querySelectorAll('.type-card');
  const actionTabs    = document.querySelectorAll('.action-tab');
  const fromValEl     = document.getElementById('from-val');
  const toValEl       = document.getElementById('to-val');
  const fromUnitEl    = document.getElementById('from-unit');
  const toUnitEl      = document.getElementById('to-unit');
  const fromErrEl     = document.getElementById('from-err');
  const toErrEl       = document.getElementById('to-err');
  const fromLabelEl   = document.getElementById('from-label');
  const toLabelEl     = document.getElementById('to-label');
  const opBtnGrid     = document.getElementById('op-btn-grid');
  const centerArrow   = document.getElementById('center-arrow');
  const opBtns        = document.querySelectorAll('.op-btn');
  const resultAreaEl  = document.getElementById('result-area');
  const calcBtn       = document.getElementById('calc-btn');
  const errorBannerEl = document.getElementById('api-error-banner');
  const histListEl    = document.getElementById('history-list');
  const clearHistBtn  = document.getElementById('btn-clear-hist');

  // ── Boot: Load units for default type ──────────────────
  loadUnits(AppState.getType());

  // ── UC-01: Select Measurement Type ─────────────────────
  typeCards.forEach(card => {
    card.addEventListener('click', () => {
      typeCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      AppState.setType(card.dataset.type);
      clearResultArea(resultAreaEl);
      loadUnits(card.dataset.type);
    });
  });

  // ── UC-02: Select Action Mode ───────────────────────────
  actionTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      actionTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      AppState.setAction(tab.dataset.action);
      updateActionUI(tab.dataset.action);
      clearResultArea(resultAreaEl);
    });
  });

  // ── UC-08: Select Arithmetic Operator ──────────────────
  opBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      opBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      AppState.setOperator(btn.dataset.op);
    });
  });

  // ── UC-05: Input validation on keystroke ───────────────
  fromValEl.addEventListener('input', () => {
    const v = validateInput(fromValEl.value);
    applyValidationState(fromValEl, fromErrEl, v);
    AppState.setFromValue(v.valid ? parseFloat(fromValEl.value) : null);
    clearResultArea(resultAreaEl);
  });

  toValEl.addEventListener('input', () => {
    const v = validateInput(toValEl.value);
    applyValidationState(toValEl, toErrEl, v);
    AppState.setToValue(v.valid ? parseFloat(toValEl.value) : null);
    clearResultArea(resultAreaEl);
  });

  fromValEl.addEventListener('blur', () => {
    if (fromValEl.value === '') {
      applyValidationState(fromValEl, fromErrEl, { valid: false, message: 'This field is required.' });
    }
  });
  toValEl.addEventListener('blur', () => {
    if (toValEl.value === '' && AppState.getAction() !== 'Conversion') {
      applyValidationState(toValEl, toErrEl, { valid: false, message: 'This field is required.' });
    }
  });

  // ── UC-06/07: Unit dropdowns ────────────────────────────
  fromUnitEl.addEventListener('change', () => {
    AppState.setFromUnit(fromUnitEl.value);
    clearResultArea(resultAreaEl);
  });
  toUnitEl.addEventListener('change', () => {
    AppState.setToUnit(toUnitEl.value);
    clearResultArea(resultAreaEl);
  });

  // ── Calculate button ────────────────────────────────────
  calcBtn.addEventListener('click', handleCalculate);

  // Enter key triggers calculate
  [fromValEl, toValEl].forEach(el => {
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter') handleCalculate();
    });
  });

  // ── Clear History ───────────────────────────────────────
  clearHistBtn.addEventListener('click', () => {
    AppState.clearHistory();
    localStorage.removeItem('qm_history');
    renderHistory(histListEl, []);
    showToast('History cleared.');
  });

  // ── UC-14: Load history on init ─────────────────────────
  (async () => {
    const hist = await getHistory();
    AppState.setHistory(hist);
    renderHistory(histListEl, hist);
  })();

  // ── Internal Helpers ────────────────────────────────────

  /**
   * UC-03 + UC-04: Fetch units and populate both dropdowns.
   */
  async function loadUnits(type) {
    calcBtn.disabled = true;
    try {
      const units = await getUnits(type);
      if (!units || units.length === 0) {
        showErrorBanner(errorBannerEl, 'No units available for this type.');
        calcBtn.disabled = true;
        return;
      }
      AppState.setUnits(units);
      // Default: FROM = first unit, TO = second unit
      populateDropdown(fromUnitEl, units, units[0].symbol);
      populateDropdown(toUnitEl,   units, units.length > 1 ? units[1].symbol : units[0].symbol);
      AppState.setFromUnit(fromUnitEl.value);
      AppState.setToUnit(toUnitEl.value);
      showErrorBanner(errorBannerEl, null);
      calcBtn.disabled = false;
    } catch (err) {
      showErrorBanner(errorBannerEl, 'Could not load units. Is json-server running?');
      calcBtn.disabled = true;
    }
  }

  /**
   * Update UI for action mode switch.
   */
  function updateActionUI(action) {
    toggleOperators(opBtnGrid, centerArrow, action);
    if (action === 'Arithmetic') {
      fromLabelEl.textContent = 'VALUE 1';
      toLabelEl.textContent   = 'VALUE 2';
    } else {
      fromLabelEl.textContent = 'FROM';
      toLabelEl.textContent   = 'TO';
    }
    // Conversion: only FROM value needed
    toValEl.disabled = false;
    applyValidationState(toValEl, toErrEl, { valid: true, message: '' });
  }

  /**
   * Main calculate handler — routes to the correct use case.
   */
  async function handleCalculate() {
    const action   = AppState.getAction();
    const fromSym  = fromUnitEl.value;
    const toSym    = toUnitEl.value;
    const fromRaw  = fromValEl.value;
    const toRaw    = toValEl.value;

    // ── UC-17: Validate ──────────────────────────────────
    const fromV = validateInput(fromRaw);
    applyValidationState(fromValEl, fromErrEl, fromV);
    if (!fromV.valid) { showToast('⚠ Please fix input errors.'); return; }

    let fromVal = parseFloat(fromRaw);
    let toVal;

    if (action !== 'Conversion') {
      const toV = validateInput(toRaw);
      applyValidationState(toValEl, toErrEl, toV);
      if (!toV.valid) { showToast('⚠ Please fix input errors.'); return; }
      toVal = parseFloat(toRaw);
    }

    // ── Dispatch to use case ─────────────────────────────
    if (action === 'Conversion') {
      await handleConversion(fromVal, fromSym, toSym);
    } else if (action === 'Comparison') {
      await handleComparison(fromVal, fromSym, toVal, toSym);
    } else if (action === 'Arithmetic') {
      await handleArithmetic(fromVal, fromSym, toVal, toSym);
    }
  }

  // ── UC-09: Conversion ───────────────────────────────────
  async function handleConversion(fromVal, fromSym, toSym) {
    if (fromSym === toSym) {
      const r = formatResult(fromVal);
      showConversionResult(resultAreaEl, r, toSym, `${fromVal} ${fromSym} = ${r} ${toSym}`);
      saveHistory('Conversion', `${fromVal} ${fromSym} → ${toSym}`, `${r} ${toSym}`);
      return;
    }
    const conv = await getConversion(fromSym, toSym);
    const { result, error } = performConversion(fromVal, conv);
    if (error) { showResultError(resultAreaEl, error); return; }
    const r = formatResult(result);
    showConversionResult(resultAreaEl, r, toSym, `${fromVal} ${fromSym} = ${r} ${toSym}`);
    saveHistory('Conversion', `${fromVal} ${fromSym} → ${toSym}`, `${r} ${toSym}`);
  }

  // ── UC-10: Comparison ───────────────────────────────────
  async function handleComparison(fromVal, fromSym, toVal, toSym) {
    // Get conversions to a base unit for both
    const baseUnit = getBaseUnit(AppState.getType());
    const fromConv = fromSym !== baseUnit ? await getConversion(fromSym, baseUnit) : { from:fromSym, to:fromSym, factor:1, formula:null };
    const toConv   = toSym   !== baseUnit ? await getConversion(toSym,   baseUnit) : { from:toSym,   to:toSym,   factor:1, formula:null };

    const { symbol, error } = performComparison(fromVal, toVal, fromConv, toConv);
    if (error) { showResultError(resultAreaEl, error); return; }
    showComparisonResult(resultAreaEl, `${fromVal} ${fromSym}`, symbol, `${toVal} ${toSym}`);
    const expr = `${fromVal} ${fromSym} ${symbol} ${toVal} ${toSym}`;
    saveHistory('Comparison', expr, expr);
  }

  // ── UC-11: Arithmetic ───────────────────────────────────
  async function handleArithmetic(fromVal, fromSym, toVal, toSym) {
    const op = AppState.getOperator();
    let normConv = null;
    if (fromSym !== toSym) {
      normConv = await getConversion(toSym, fromSym);
    }
    const { result, error } = performArithmetic(fromVal, toVal, op, normConv);
    if (error) { showResultError(resultAreaEl, error); return; }
    const r = formatResult(result);
    const opDisplay = { '+':'+', '-':'−', '*':'×', '/':'÷' }[op];
    const subText = `${fromVal} ${fromSym} ${opDisplay} ${toVal} ${toSym} = ${r} ${fromSym}`;
    showArithmeticResult(resultAreaEl, r, fromSym, subText);
    saveHistory('Arithmetic', subText, `${r} ${fromSym}`);
  }

  // ── UC-13: Save to History ──────────────────────────────
  async function saveHistory(action, expression, result) {
    const rec = {
      id:         Date.now(),
      type:       AppState.getType(),
      action,
      expression,
      result,
      timestamp:  new Date().toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' }),
    };
    AppState.addHistory(rec);
    // Persist to localStorage (fallback if json-server is down)
    localStorage.setItem('qm_history', JSON.stringify(AppState.getHistory()));
    // POST to json-server (non-blocking)
    postHistory(rec);
    // Refresh history panel
    renderHistory(histListEl, AppState.getHistory());
    showToast('✓ Result calculated');
  }

  // ── Helper: base unit per type ──────────────────────────
  function getBaseUnit(type) {
    return { Length:'m', Weight:'kg', Temperature:'C', Volume:'L' }[type] || 'm';
  }
});
