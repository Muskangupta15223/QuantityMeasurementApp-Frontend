import { BASE_URL } from "../utils/constants";

const request = async (method, path, body, token) => {
  const headers = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = res.headers.get("content-type");

  let data;

  if (contentType && contentType.includes("application/json")) {
    data = await res.json();   
  } else {
    data = await res.text();   
  }

  if (!res.ok) {
    throw new Error(data?.message || data || "Request failed");
  }

  return data;
};
// ── Auth ──────────────────────────────────────────────────────────────────────
export const authApi = {
  register: (payload) => request("POST", "/auth/register", payload),
  login: (payload) => request("POST", "/auth/login", payload),
};

// ── Quantity Operations ───────────────────────────────────────────────────────
const buildQuantityBody = (val1, unit1, type, val2, unit2) => ({
  thisQuantityDTO: { value: parseFloat(val1), unit: unit1, measurementType: type },
  thatQuantityDTO: { value: parseFloat(val2 ?? 0), unit: unit2, measurementType: type },
});

export const quantityApi = {
  compare: (val1, unit1, type, val2, unit2, token) =>
    request("POST", "/api/v1/quantities/compare", buildQuantityBody(val1, unit1, type, val2, unit2), token),

  convert: (val1, unit1, type, val2, unit2, token) =>
    request("POST", "/api/v1/quantities/convert", buildQuantityBody(val1, unit1, type, val2, unit2), token),

  add: (val1, unit1, type, val2, unit2, token) =>
    request("POST", "/api/v1/quantities/add", buildQuantityBody(val1, unit1, type, val2, unit2), token),

  subtract: (val1, unit1, type, val2, unit2, token) =>
    request("POST", "/api/v1/quantities/subtract", buildQuantityBody(val1, unit1, type, val2, unit2), token),

  divide: (val1, unit1, type, val2, unit2, token) =>
    request("POST", "/api/v1/quantities/divide", buildQuantityBody(val1, unit1, type, val2, unit2), token),
};

// ── History ───────────────────────────────────────────────────────────────────
export const historyApi = {
  getAll: (token) => request("GET", "/api/v1/quantities/my/history", null, token),
  getByOperation: (operation, token) =>
    request("GET", `/api/v1/quantities/my/history/operation/${operation}`, null, token),
  getByType: (measurementType, token) =>
    request("GET", `/api/v1/quantities/my/history/type/${measurementType}`, null, token),
  getErrored: (token) => request("GET", "/api/v1/quantities/my/history/errored", null, token),
  getCount: (operation, token) =>
    request("GET", `/api/v1/quantities/my/count/${operation}`, null, token),
};
