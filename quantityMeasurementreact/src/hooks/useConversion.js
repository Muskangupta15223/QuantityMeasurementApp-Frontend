import { useCallback, useState } from "react";
import { quantityApi } from "../services/api";
import { useMeasurement, ACTIONS } from "../context/MeasurementContext";

export function useConversion(token) {
  const { state, dispatch } = useMeasurement();
  const [calculating, setCalculating] = useState(false);

  const calculate = useCallback(async () => {
    const { selectedType, selectedMode, arithmeticOp,
            fromValue, toValue, fromUnit, toUnit } = state;

    if (!fromValue || isNaN(parseFloat(fromValue))) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: "Please enter a valid number." });
      return;
    }

    // Compare and Arithmetic need a second value
    const needsSecond = selectedMode.id === "compare" || selectedMode.id === "arithmetic";
    if (needsSecond && (!toValue || isNaN(parseFloat(toValue)))) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: "Please enter a valid second value." });
      return;
    }

    setCalculating(true);
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });

    try {
      // Resolve which backend endpoint to call
      let apiId;
      if (selectedMode.id === "arithmetic") apiId = arithmeticOp.id;
      else apiId = selectedMode.id; // "convert" | "compare"

      const fn = quantityApi[apiId];
      const result = await fn(
        fromValue, fromUnit, selectedType.id,
        toValue,   toUnit,
        token
      );
      dispatch({ type: ACTIONS.SET_RESULT, payload: result });
    } catch (e) {
      dispatch({ type: ACTIONS.SET_ERROR, payload: e.message });
    } finally {
      setCalculating(false);
    }
  }, [state, token, dispatch]);

  return { calculate, calculating };
}
