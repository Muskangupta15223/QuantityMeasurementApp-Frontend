import { useState, useEffect } from "react";
import { useToast } from "../components/Toast";
import styles from "./AuthPage.module.css";

/**
 * AuthPage renders as a modal overlay.
 * Props:
 *   initialTab  – "login" | "register"
 *   onClose     – called when modal should close
 *   onSuccess   – called with (token, email) after successful login
 *   authHook    – { login, register, loading, error, clearError } from useAuth
 */
// Works for both monolithic (directly on 8080) and microservices (via API Gateway on 8080)
const GOOGLE_AUTH_URL = "http://localhost:8080/oauth2/authorization/google";

export default function AuthPage({ initialTab = "login", onClose, onSuccess, authHook }) {
  const { login, register, loading, error, clearError } = authHook;
  const { addToast } = useToast();

  const [tab, setTab] = useState(initialTab);
  const [form, setForm] = useState({ email: "", password: "", name: "" });

  // Sync tab when parent changes it (e.g. "history" click → open login tab)
  useEffect(() => { setTab(initialTab); }, [initialTab]);

  // Clear errors when switching tabs or changing fields
  useEffect(() => { clearError(); }, [tab, clearError]);

  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    clearError();
  };

  const handleSubmit = async () => {
    if (tab === "login") {
      const ok = await login(form.email, form.password);
      if (ok) {
        addToast("Welcome back! 👋", "success");
        onSuccess?.();
        onClose?.();
      }
    } else {
      if (!form.name.trim()) {
        addToast("Please enter your name.", "error");
        return;
      }
      const ok = await register(form.email, form.password, form.name);
      if (ok) {
        addToast("Account created! Please sign in.", "success");
        setTab("login");
        setForm((f) => ({ ...f, password: "" }));
      }
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter" && !loading) handleSubmit();
  };
    const handleGoogleLogin = () => {
    window.location.href = GOOGLE_AUTH_URL;
  };

  return (
    <div className={styles.overlay} onClick={(e) => e.target === e.currentTarget && onClose?.()}>
      <div className={styles.modal}>
        <button className={styles.closeBtn} onClick={onClose} aria-label="Close">×</button>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.brand}>QuantityMeasurement</div>
          <p className={styles.subtitle}>
            {tab === "login"
              ? "Sign in to track your calculation history"
              : "Create a free account to get started"}
          </p>
        </div>

        {/* Tab switcher */}
        <div className={styles.tabBar}>
          {[
            { id: "login",    label: "Sign In" },
            { id: "register", label: "Sign Up" },
          ].map(({ id, label }) => (
            <button
              key={id}
              className={`${styles.tab} ${tab === id ? styles.tabActive : ""}`}
              onClick={() => setTab(id)}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Form */}
        <div className={styles.form}>
          {tab === "register" && (
            <div className={styles.field}>
              <label className={styles.fieldLabel}>FULL NAME</label>
              <input
                type="text"
                placeholder="Your name"
                value={form.name}
                onChange={set("name")}
                onKeyDown={handleKey}
                autoFocus
              />
            </div>
          )}

          <div className={styles.field}>
            <label className={styles.fieldLabel}>EMAIL ADDRESS</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={set("email")}
              onKeyDown={handleKey}
              autoFocus={tab === "login"}
            />
          </div>

          <div className={styles.field}>
            <label className={styles.fieldLabel}>PASSWORD</label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              onChange={set("password")}
              onKeyDown={handleKey}
            />
          </div>

          {error && <div className={styles.errorMsg}>{error}</div>}

          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <><span className={styles.spinner} /> Processing…</>
            ) : tab === "login" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>

          <p className={styles.toggle}>
            {tab === "login" ? "No account? " : "Already have one? "}
            <button
              className={styles.toggleLink}
              onClick={() => setTab(tab === "login" ? "register" : "login")}
            >
              {tab === "login" ? "Sign up free" : "Sign in"}
            </button>
                <div>
      {/* ...existing login form... */}
      <button onClick={handleGoogleLogin} className="google-login-btn">
        Login with Google
      </button>
    </div>
          </p>
        </div>
      </div>
    </div>
  );
}
