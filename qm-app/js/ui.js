// ============================================================
// ui.js — DOM helpers:
//         populateDropdown(), showResult(), toggleOperators(),
//         showErrorBanner(), showToast(), renderHistory()
// ============================================================

// ── UC-04: Populate Unit Dropdowns ─────────────────────────
/**
 * Clears and repopulates a <select> element with unit options.
 * @param {HTMLSelectElement} selectEl
 * @param {Array} units  - array of { label, symbol }
 * @param {string} [defaultSymbol] - pre-selected symbol
 */
function populateDropdown(selectEl, units, defaultSymbol) {
  selectEl.innerHTML = '';
  if (!units || units.length === 0) {
    const opt = document.createElement('option');
    opt.textContent = 'No units available';
    opt.disabled = true;
    selectEl.appendChild(opt);
    return;
  }
  units.forEach((unit, idx) => {
    const opt = document.createElement('option');
    opt.value       = unit.symbol;
    opt.textContent = unit.label;
    if (defaultSymbol ? unit.symbol === defaultSymbol : idx === 0) {
      opt.selected = true;
    }
    selectEl.appendChild(opt);
  });
}

// ── UC-12: Show Result ──────────────────────────────────────
/**
 * Updates the result area with a conversion result.
 * @param {HTMLElement} areaEl
 * @param {number} value
 * @param {string} unitSymbol
 * @param {string} subText  - human-readable expression label
 */
function showConversionResult(areaEl, value, unitSymbol, subText) {
  areaEl.className = 'result-area success';
  areaEl.innerHTML = `
    <div class="result-value">${value}<small>${unitSymbol}</small></div>
    <div class="result-sub">${subText}</div>
  `;
}

/**
 * Shows a comparison result sentence.
 * @param {HTMLElement} areaEl
 * @param {string} fromStr  - e.g. "5 km"
 * @param {string} symbol   - '>' | '<' | '='
 * @param {string} toStr    - e.g. "4000 m"
 */
function showComparisonResult(areaEl, fromStr, symbol, toStr) {
  areaEl.className = 'result-area success';
  areaEl.innerHTML = `
    <div class="result-cmp">${fromStr} <span class="cmp-sym">${symbol}</span> ${toStr}</div>
  `;
}

/**
 * Shows an arithmetic result.
 * @param {HTMLElement} areaEl
 * @param {number} value
 * @param {string} unitSymbol
 * @param {string} subText
 */
function showArithmeticResult(areaEl, value, unitSymbol, subText) {
  areaEl.className = 'result-area success';
  areaEl.innerHTML = `
    <div class="result-value">${value}<small>${unitSymbol}</small></div>
    <div class="result-sub">${subText}</div>
  `;
}

/**
 * Shows an error message in the result area.
 * @param {HTMLElement} areaEl
 * @param {string} message
 */
function showResultError(areaEl, message) {
  areaEl.className = 'result-area error-state';
  areaEl.innerHTML = `<div class="result-err-msg">⚠ ${message}</div>`;
}

/**
 * Resets the result area to placeholder state.
 * @param {HTMLElement} areaEl
 */
function clearResultArea(areaEl) {
  areaEl.className = 'result-area';
  areaEl.innerHTML = `<div class="result-placeholder">Enter values and select units to calculate</div>`;
}

// ── Operator visibility ─────────────────────────────────────
/**
 * Shows/hides the arithmetic operator buttons and center symbol.
 * @param {HTMLElement} opBtnGrid
 * @param {HTMLElement} centerArrow
 * @param {string} action - 'Comparison' | 'Conversion' | 'Arithmetic'
 */
function toggleOperators(opBtnGrid, centerArrow, action) {
  if (action === 'Arithmetic') {
    opBtnGrid.style.display   = 'flex';
    centerArrow.style.display = 'none';
  } else {
    opBtnGrid.style.display   = 'none';
    centerArrow.style.display = 'block';
    centerArrow.textContent   = action === 'Conversion' ? '→' : '⬌';
  }
}

// ── UC-16: Error Banner ─────────────────────────────────────
/**
 * Shows or hides the API error banner.
 * @param {HTMLElement} bannerEl
 * @param {string|null} message - null to hide
 */
function showErrorBanner(bannerEl, message) {
  if (message) {
    bannerEl.textContent = '⚠️ ' + message;
    bannerEl.classList.remove('hidden');
  } else {
    bannerEl.classList.add('hidden');
  }
}

// ── Toast notification ──────────────────────────────────────
let _toastTimer;
/**
 * Shows a brief toast notification.
 * @param {string} message
 * @param {number} [duration=2500]
 */
function showToast(message, duration = 2500) {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => toast.classList.remove('show'), duration);
}

// ── UC-14: Render History List ──────────────────────────────
/**
 * Renders history records into the sidebar list element.
 * @param {HTMLElement} listEl
 * @param {Array} records
 */
function renderHistory(listEl, records) {
  if (!records || records.length === 0) {
    listEl.innerHTML = `
      <div class="hist-empty">
        <span>🔢</span>
        No calculations yet.<br>
        Run your first calculation!
      </div>
    `;
    return;
  }
  listEl.innerHTML = records.slice(0, 60).map(r => `
    <div class="hist-item" data-type="${r.type}">
      <div class="hist-meta">${r.type} · ${r.action}</div>
      <div class="hist-expr">${r.expression}</div>
      <div class="hist-result">= ${r.result}</div>
      <div class="hist-time">${r.timestamp}</div>
    </div>
  `).join('');
}

// ── Inline field validation feedback ───────────────────────
/**
 * Applies visual validation state to an input element.
 * @param {HTMLInputElement} inputEl
 * @param {HTMLElement}      errEl
 * @param {{ valid, message }} validation
 */
function applyValidationState(inputEl, errEl, validation) {
  if (validation.valid) {
    inputEl.classList.remove('input-error');
    errEl.textContent = '';
  } else {
    inputEl.classList.add('input-error');
    errEl.textContent = validation.message;
  }
}
