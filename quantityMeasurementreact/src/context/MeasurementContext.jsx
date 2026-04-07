import { createContext, useContext, useReducer } from "react";
import { MEASUREMENT_TYPES, MODES, ARITHMETIC_OPS } from "../utils/constants";

const initialState = {
  selectedType:   MEASUREMENT_TYPES[0],
  selectedMode:   MODES[0],              // convert | compare | arithmetic
  arithmeticOp:   ARITHMETIC_OPS[0],    // add | subtract | divide
  fromValue:  "1",
  toValue:    "1",
  fromUnit:   MEASUREMENT_TYPES[0].units[0],
  toUnit:     MEASUREMENT_TYPES[0].units[1],
  result:     null,
  isLoading:  false,
  error:      null,
};

export const ACTIONS = {
  SET_TYPE:         "SET_TYPE",
  SET_MODE:         "SET_MODE",
  SET_ARITH_OP:     "SET_ARITH_OP",
  SET_FROM_VALUE:   "SET_FROM_VALUE",
  SET_TO_VALUE:     "SET_TO_VALUE",
  SET_FROM_UNIT:    "SET_FROM_UNIT",
  SET_TO_UNIT:      "SET_TO_UNIT",
  SET_RESULT:       "SET_RESULT",
  SET_LOADING:      "SET_LOADING",
  SET_ERROR:        "SET_ERROR",
  CLEAR_RESULT:     "CLEAR_RESULT",
  RESET:            "RESET",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.SET_TYPE:
      return { ...state, selectedType: payload,
        fromUnit: payload.units[0], toUnit: payload.units[1] || payload.units[0],
        result: null, error: null };
    case ACTIONS.SET_MODE:
      return { ...state, selectedMode: payload, result: null, error: null };
    case ACTIONS.SET_ARITH_OP:
      return { ...state, arithmeticOp: payload, result: null, error: null };
    case ACTIONS.SET_FROM_VALUE:
      return { ...state, fromValue: payload, result: null };
    case ACTIONS.SET_TO_VALUE:
      return { ...state, toValue: payload, result: null };
    case ACTIONS.SET_FROM_UNIT:
      return { ...state, fromUnit: payload, result: null };
    case ACTIONS.SET_TO_UNIT:
      return { ...state, toUnit: payload, result: null };
    case ACTIONS.SET_RESULT:
      return { ...state, result: payload, isLoading: false, error: null };
    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: payload };
    case ACTIONS.SET_ERROR:
      return { ...state, error: payload, isLoading: false };
    case ACTIONS.CLEAR_RESULT:
      return { ...state, result: null, error: null };
    case ACTIONS.RESET:
      return { ...initialState };
    default:
      return state;
  }
}

const MeasurementContext = createContext(null);

export function MeasurementProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <MeasurementContext.Provider value={{ state, dispatch }}>
      {children}
    </MeasurementContext.Provider>
  );
}

export const useMeasurement = () => {
  const ctx = useContext(MeasurementContext);
  if (!ctx) throw new Error("useMeasurement must be inside MeasurementProvider");
  return ctx;
};
