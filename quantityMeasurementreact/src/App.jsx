import { useState, useEffect } from "react";

// Context & Providers
import { MeasurementProvider } from "./context/MeasurementContext";
import { ToastProvider }       from "./components/Toast";

// Hooks
import { useAuth } from "./hooks/useAuth";

// Components
import Navbar        from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import DashboardPage from "./pages/DashboardPage";
import HistoryPage   from "./pages/HistoryPage";
import AuthPage      from "./pages/AuthPage";

export default function App() {
  // ── Auth ────────────────────────────────────────────────────────────────────
  const auth = useAuth();
  const { user, token, logout } = auth;

  // ── Page routing ─────────────────────────────────────────────────────────────
  const [page, setPage] = useState("dashboard"); // "dashboard" | "history"

  // ── Auth modal ───────────────────────────────────────────────────────────────
  // null = closed | "login" | "register"
  const [authTab, setAuthTab] = useState(null);

  const openAuth = (tab = "login") => setAuthTab(tab);
  const closeAuth = () => setAuthTab(null);

  // If user just logged in and was trying to go to history, send them there
  const handleAuthSuccess = () => {
    if (page === "history") return; // already there
  };

  // Navigate helper — guard the history route
  const navigate = (target) => {
    if (target === "history" && !user) {
      openAuth("login");
      return;
    }
    setPage(target);
  };

  // When user logs out from history page, bounce back to dashboard
  const handleLogout = () => {
    logout();
    if (page === "history") setPage("dashboard");
  };

  return (
    <ToastProvider>
      <MeasurementProvider>
        {/* ── Navigation ─────────────────────────────────────────────────────── */}
        <Navbar
          page={page}
          onNavigate={navigate}
          user={user}
          onLogin={() => openAuth("login")}
          onLogout={handleLogout}
        />

        {/* ── Pages ──────────────────────────────────────────────────────────── */}
        {page === "dashboard" && (
          <DashboardPage
            user={user}
            token={token}
            onOpenAuth={openAuth}
          />
        )}

        {page === "history" && (
          <ProtectedRoute user={user} onRedirect={() => { setPage("dashboard"); openAuth("login"); }}>
            <HistoryPage
              user={user}
              token={token}
              onOpenAuth={openAuth}
            />
          </ProtectedRoute>
        )}

        {/* ── Auth Modal ─────────────────────────────────────────────────────── */}
        {authTab && (
          <AuthPage
            initialTab={authTab}
            onClose={closeAuth}
            onSuccess={handleAuthSuccess}
            authHook={auth}
          />
        )}
      </MeasurementProvider>
    </ToastProvider>
  );
}
