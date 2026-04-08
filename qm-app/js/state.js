// ============================================================
// state.js — Module-level state:
//            selectedType, selectedAction, values, units, user
// ============================================================

const AppState = (() => {
  let state = {
    // Auth
    currentUser: null,

    // Measurement
    selectedType:   'Length',
    selectedAction: 'Comparison',
    selectedOperator: '+',

    fromValue: null,
    toValue:   null,
    fromUnit:  null,
    toUnit:    null,

    units: [],         // fetched from API / fallback
    conversions: [],   // fetched from API / fallback

    history: [],       // persisted in localStorage
  };

  return {
    get: (key)        => state[key],
    set: (key, value) => { state[key] = value; },
    getAll:           () => ({ ...state }),

    // Convenience setters
    setUser:     (u) => { state.currentUser = u; },
    getUser:     ()  => state.currentUser,

    setType:     (t) => { state.selectedType = t; },
    getType:     ()  => state.selectedType,

    setAction:   (a) => { state.selectedAction = a; },
    getAction:   ()  => state.selectedAction,

    setOperator: (o) => { state.selectedOperator = o; },
    getOperator: ()  => state.selectedOperator,

    setFromValue: (v) => { state.fromValue = v; },
    setToValue:   (v) => { state.toValue = v; },
    setFromUnit:  (u) => { state.fromUnit = u; },
    setToUnit:    (u) => { state.toUnit = u; },

    setUnits:       (arr) => { state.units = arr; },
    setConversions: (arr) => { state.conversions = arr; },

    // History
    addHistory:   (rec) => { state.history.unshift(rec); },
    getHistory:   ()    => state.history,
    setHistory:   (arr) => { state.history = arr; },
    clearHistory: ()    => { state.history = []; },
  };
})();
