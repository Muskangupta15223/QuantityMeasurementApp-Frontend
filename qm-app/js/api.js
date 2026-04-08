// ============================================================
// api.js — Fetch wrappers for json-server REST API
//          getUnits(), getConversion(), postHistory(), getHistory()
//          Falls back to embedded data if server is unreachable.
// ============================================================

const API_BASE = 'http://localhost:3000';

// ── Embedded fallback data (mirrors db.json) ────────────────
const FALLBACK = {
  units: [
    { id:1,  type:'Length',      label:'Kilometer',   symbol:'km'   },
    { id:2,  type:'Length',      label:'Meter',       symbol:'m'    },
    { id:3,  type:'Length',      label:'Centimeter',  symbol:'cm'   },
    { id:4,  type:'Length',      label:'Millimeter',  symbol:'mm'   },
    { id:5,  type:'Length',      label:'Mile',        symbol:'mi'   },
    { id:6,  type:'Length',      label:'Yard',        symbol:'yd'   },
    { id:7,  type:'Length',      label:'Foot',        symbol:'ft'   },
    { id:8,  type:'Length',      label:'Inch',        symbol:'in'   },
    { id:9,  type:'Weight',      label:'Tonne',       symbol:'t'    },
    { id:10, type:'Weight',      label:'Kilogram',    symbol:'kg'   },
    { id:11, type:'Weight',      label:'Gram',        symbol:'g'    },
    { id:12, type:'Weight',      label:'Milligram',   symbol:'mg'   },
    { id:13, type:'Weight',      label:'Pound',       symbol:'lb'   },
    { id:14, type:'Weight',      label:'Ounce',       symbol:'oz'   },
    { id:15, type:'Temperature', label:'Celsius',     symbol:'C'    },
    { id:16, type:'Temperature', label:'Fahrenheit',  symbol:'F'    },
    { id:17, type:'Temperature', label:'Kelvin',      symbol:'K'    },
    { id:18, type:'Volume',      label:'Liter',       symbol:'L'    },
    { id:19, type:'Volume',      label:'Milliliter',  symbol:'mL'   },
    { id:20, type:'Volume',      label:'Cubic Meter', symbol:'m3'   },
    { id:21, type:'Volume',      label:'Gallon',      symbol:'gal'  },
    { id:22, type:'Volume',      label:'Quart',       symbol:'qt'   },
    { id:23, type:'Volume',      label:'Pint',        symbol:'pt'   },
    { id:24, type:'Volume',      label:'Cup',         symbol:'cup'  },
    { id:25, type:'Volume',      label:'Fluid Ounce', symbol:'floz' },
  ],
  conversions: [
    { from:'km', to:'m',    factor:1000,        formula:null },
    { from:'km', to:'cm',   factor:100000,      formula:null },
    { from:'km', to:'mm',   factor:1000000,     formula:null },
    { from:'km', to:'mi',   factor:0.621371,    formula:null },
    { from:'km', to:'yd',   factor:1093.61,     formula:null },
    { from:'km', to:'ft',   factor:3280.84,     formula:null },
    { from:'km', to:'in',   factor:39370.1,     formula:null },
    { from:'m',  to:'km',   factor:0.001,       formula:null },
    { from:'m',  to:'cm',   factor:100,         formula:null },
    { from:'m',  to:'mm',   factor:1000,        formula:null },
    { from:'m',  to:'mi',   factor:0.000621371, formula:null },
    { from:'m',  to:'yd',   factor:1.09361,     formula:null },
    { from:'m',  to:'ft',   factor:3.28084,     formula:null },
    { from:'m',  to:'in',   factor:39.3701,     formula:null },
    { from:'cm', to:'m',    factor:0.01,        formula:null },
    { from:'cm', to:'km',   factor:0.00001,     formula:null },
    { from:'cm', to:'mm',   factor:10,          formula:null },
    { from:'cm', to:'in',   factor:0.393701,    formula:null },
    { from:'cm', to:'ft',   factor:0.0328084,   formula:null },
    { from:'mm', to:'m',    factor:0.001,       formula:null },
    { from:'mm', to:'cm',   factor:0.1,         formula:null },
    { from:'mi', to:'km',   factor:1.60934,     formula:null },
    { from:'mi', to:'m',    factor:1609.34,     formula:null },
    { from:'yd', to:'m',    factor:0.9144,      formula:null },
    { from:'ft', to:'m',    factor:0.3048,      formula:null },
    { from:'in', to:'cm',   factor:2.54,        formula:null },
    { from:'in', to:'m',    factor:0.0254,      formula:null },
    { from:'t',  to:'kg',   factor:1000,        formula:null },
    { from:'kg', to:'t',    factor:0.001,       formula:null },
    { from:'kg', to:'g',    factor:1000,        formula:null },
    { from:'kg', to:'mg',   factor:1000000,     formula:null },
    { from:'kg', to:'lb',   factor:2.20462,     formula:null },
    { from:'kg', to:'oz',   factor:35.274,      formula:null },
    { from:'g',  to:'kg',   factor:0.001,       formula:null },
    { from:'g',  to:'mg',   factor:1000,        formula:null },
    { from:'mg', to:'g',    factor:0.001,       formula:null },
    { from:'lb', to:'kg',   factor:0.453592,    formula:null },
    { from:'oz', to:'g',    factor:28.3495,     formula:null },
    { from:'C',  to:'F',    factor:null, formula:'(val * 9/5) + 32' },
    { from:'C',  to:'K',    factor:null, formula:'val + 273.15' },
    { from:'F',  to:'C',    factor:null, formula:'(val - 32) * 5/9' },
    { from:'F',  to:'K',    factor:null, formula:'((val - 32) * 5/9) + 273.15' },
    { from:'K',  to:'C',    factor:null, formula:'val - 273.15' },
    { from:'K',  to:'F',    factor:null, formula:'((val - 273.15) * 9/5) + 32' },
    { from:'L',  to:'mL',   factor:1000,      formula:null },
    { from:'L',  to:'m3',   factor:0.001,     formula:null },
    { from:'L',  to:'gal',  factor:0.264172,  formula:null },
    { from:'L',  to:'qt',   factor:1.05669,   formula:null },
    { from:'L',  to:'pt',   factor:2.11338,   formula:null },
    { from:'L',  to:'cup',  factor:4.22675,   formula:null },
    { from:'L',  to:'floz', factor:33.814,    formula:null },
    { from:'mL', to:'L',    factor:0.001,     formula:null },
    { from:'m3', to:'L',    factor:1000,      formula:null },
    { from:'gal',to:'L',    factor:3.78541,   formula:null },
    { from:'qt', to:'L',    factor:0.946353,  formula:null },
    { from:'pt', to:'L',    factor:0.473176,  formula:null },
    { from:'cup',to:'L',    factor:0.236588,  formula:null },
    { from:'floz',to:'mL',  factor:29.5735,   formula:null },
  ]
};

// ── API helpers ─────────────────────────────────────────────

/**
 * UC-03: Fetch all units for a given measurement type.
 * GET /units?type=Length
 * @param {string} type - 'Length' | 'Weight' | 'Temperature' | 'Volume'
 * @returns {Promise<Array>} unit objects
 */
async function getUnits(type) {
  try {
    const res = await fetch(`${API_BASE}/units?type=${type}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[api.js] getUnits fallback:', err.message);
    return FALLBACK.units.filter(u => u.type === type);
  }
}

/**
 * UC-09/10/11: Fetch conversion record for a unit pair.
 * GET /conversions?from=km&to=m
 * @param {string} from - source unit symbol
 * @param {string} to   - target unit symbol
 * @returns {Promise<Object|null>} conversion object or null
 */
async function getConversion(from, to) {
  if (from === to) return { from, to, factor: 1, formula: null };
  try {
    const res = await fetch(`${API_BASE}/conversions?from=${from}&to=${to}`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return data.length ? data[0] : null;
  } catch (err) {
    console.warn('[api.js] getConversion fallback:', err.message);
    const found = FALLBACK.conversions.find(c => c.from === from && c.to === to);
    return found || null;
  }
}

/**
 * UC-13: Save calculation record to /history via POST.
 * @param {Object} record - { type, action, expression, result, timestamp }
 * @returns {Promise<Object|null>} created record or null
 */
async function postHistory(record) {
  try {
    const res = await fetch(`${API_BASE}/history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(record),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[api.js] postHistory fallback (localStorage):', err.message);
    // Non-blocking fallback: already saved via AppState + localStorage in app.js
    return null;
  }
}

/**
 * UC-14: Fetch all history records, newest first.
 * GET /history?_sort=timestamp&_order=desc
 * @returns {Promise<Array>} history records
 */
async function getHistory() {
  try {
    const res = await fetch(`${API_BASE}/history?_sort=id&_order=desc`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('[api.js] getHistory fallback (localStorage):', err.message);
    return JSON.parse(localStorage.getItem('qm_history') || '[]');
  }
}

/**
 * UC-14: Delete a history record by id.
 * DELETE /history/:id
 */
async function deleteHistory(id) {
  try {
    await fetch(`${API_BASE}/history/${id}`, { method: 'DELETE' });
  } catch (err) {
    console.warn('[api.js] deleteHistory error:', err.message);
  }
}
