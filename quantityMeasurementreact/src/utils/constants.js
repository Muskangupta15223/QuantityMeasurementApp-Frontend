export const BASE_URL = "http://localhost:8080";

export const MEASUREMENT_TYPES = [
  { id: "LengthUnit",      label: "Length",      icon: "📏", units: ["FEET","INCHES","YARDS","CENTIMETERS"] },
  { id: "WeightUnit",      label: "Weight",      icon: "⚖️",  units: ["KILOGRAM","GRAM","POUND"] },
  { id: "TemperatureUnit", label: "Temperature", icon: "🌡️", units: ["CELSIUS","FAHRENHEIT","KELVIN"] },
  { id: "VolumeUnit",      label: "Volume",      icon: "🧪", units: ["LITRE","MILLILITRE","GALLON"] },
];

// 3 top-level modes shown as tabs
export const MODES = [
  { id: "convert",    label: "Conversion"  },
  { id: "compare",    label: "Comparison"  },
  { id: "arithmetic", label: "Arithmetic"  },
];

// Arithmetic sub-operations shown in dropdown
export const ARITHMETIC_OPS = [
  { id: "add",      label: "Add ( + )",       symbol: "+" },
  { id: "subtract", label: "Subtract ( − )",  symbol: "−" },
  { id: "divide",   label: "Divide ( ÷ )",    symbol: "÷" },
];

export const HISTORY_FILTERS = [
  { id: "all",      label: "All"      },
  { id: "convert",  label: "Convert"  },
  { id: "compare",  label: "Compare"  },
  { id: "add",      label: "Add"      },
  { id: "subtract", label: "Subtract" },
  { id: "divide",   label: "Divide"   },
  { id: "errored",  label: "Errors"   },
];

export const formatUnit  = (u) => u ? u.charAt(0) + u.slice(1).toLowerCase() : "";
export const formatValue = (val, dec = 6) =>
  val !== null && val !== undefined ? parseFloat(val.toFixed(dec)) : null;
