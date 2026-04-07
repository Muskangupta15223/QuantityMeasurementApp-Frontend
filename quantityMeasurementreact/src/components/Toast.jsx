import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be inside ToastProvider");
  return ctx;
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3600);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((p) => p.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {toasts.length > 0 && (
        <div style={{
          position: "fixed", bottom: 26, right: 26, zIndex: 9999,
          display: "flex", flexDirection: "column", gap: 10, pointerEvents: "none",
        }}>
          {toasts.map((t) => <ToastItem key={t.id} toast={t} onRemove={removeToast} />)}
        </div>
      )}
    </ToastContext.Provider>
  );
}

const ICON  = { success: "✓", error: "✕", info: "i", warning: "!" };
const BORD  = {
  success: "rgba(12,170,110,0.3)",
  error:   "rgba(232,69,60,0.3)",
  info:    "rgba(91,80,232,0.25)",
  warning: "rgba(217,119,6,0.3)",
};
const ICON_COLOR = {
  success: "var(--teal2)",
  error:   "var(--coral)",
  info:    "var(--accent)",
  warning: "var(--amber)",
};

function ToastItem({ toast, onRemove }) {
  return (
    <div
      onClick={() => onRemove(toast.id)}
      style={{
        display: "flex", alignItems: "center", gap: 10,
        padding: "12px 16px", borderRadius: "var(--r)",
        background: "var(--surface)",
        border: `1.5px solid ${BORD[toast.type] || BORD.info}`,
        color: "var(--text)", fontSize: 14, maxWidth: 340, minWidth: 220,
        pointerEvents: "all", cursor: "pointer",
        animation: "toastIn 0.28s cubic-bezier(.22,1,.36,1)",
        boxShadow: "var(--shadow-lg)",
        fontFamily: "var(--font-body)",
      }}
    >
      <span style={{
        color: ICON_COLOR[toast.type] || ICON_COLOR.info,
        fontWeight: 700, fontSize: 14, flexShrink: 0,
        width: 20, height: 20, borderRadius: "50%",
        background: BORD[toast.type]?.replace("0.3", "0.12") || "var(--accent-bg)",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        {ICON[toast.type] || ICON.info}
      </span>
      <span style={{ flex: 1, lineHeight: 1.4 }}>{toast.message}</span>
    </div>
  );
}
