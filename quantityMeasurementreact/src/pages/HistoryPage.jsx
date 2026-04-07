import { useState } from "react";
import { useHistory }  from "../hooks/useHistory";
import HistoryList     from "../components/HistoryList";
import { MEASUREMENT_TYPES, HISTORY_FILTERS } from "../utils/constants";
import styles from "./HistoryPage.module.css";

const STAT_COLORS = {
  total:   "var(--accent2)",
  errors:  "var(--coral)",
  convert: "var(--teal)",
  compare: "var(--amber)",
};

export default function HistoryPage({ user, token, onOpenAuth }) {
  const { history, loading, filter, setFilter, refresh } = useHistory(token);
  const [typeFilter, setTypeFilter] = useState("all");

  /* ── Not logged in ─────────────────────────────────────────── */
  if (!user) {
    return (
      <div className={styles.gate}>
        <div className={styles.gateIcon}>🔒</div>
        <h2 className={styles.gateTitle}>Sign in to view history</h2>
        <p className={styles.gateSub}>
          Your calculation history is personal and saved securely to your account.
          Sign in to access it anytime.
        </p>
        <button className={styles.gateBtn} onClick={() => onOpenAuth("login")}>
          Sign In
        </button>
      </div>
    );
  }

  /* ── Derived stats ─────────────────────────────────────────── */
  const stats = [
    { label: "TOTAL",     value: history.length,                                   color: STAT_COLORS.total   },
    { label: "ERRORS",    value: history.filter((h) => h.error).length,             color: STAT_COLORS.errors  },
    { label: "CONVERTS",  value: history.filter((h) => h.operation === "convert").length, color: STAT_COLORS.convert },
    { label: "COMPARES",  value: history.filter((h) => h.operation === "compare").length, color: STAT_COLORS.compare },
  ];

  /* ── Type filter applied client-side ───────────────────────── */
  const displayed =
    typeFilter === "all"
      ? history
      : history.filter((h) => h.thisMeasurementType === typeFilter);

  /* ── Render ────────────────────────────────────────────────── */
  return (
    <main className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.userRow}>
          <div className={styles.avatar}>{user.email[0].toUpperCase()}</div>
          <div className={styles.userInfo}>
            <div className={styles.userLabel}>Signed in as</div>
            <div className={styles.userEmail}>{user.email}</div>
          </div>
        </div>
        <h1 className={styles.pageTitle}>Your History</h1>
        <p className={styles.pageSub}>All calculations saved automatically to your account.</p>
      </div>

      {/* Stats */}
      <div className={styles.stats}>
        {stats.map((s) => (
          <div key={s.label} className={styles.statCard}>
            <div className={styles.statLabel}>{s.label}</div>
            <div className={styles.statValue} style={{ color: s.color }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Operation filter */}
      <div className={styles.filters}>
        <div className={styles.filterLabel}>FILTER BY OPERATION</div>
        <div className={styles.tabBar}>
          {HISTORY_FILTERS.map((f) => (
            <button
              key={f.id}
              className={`${styles.tab} ${filter === f.id ? styles.tabActive : ""}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Type pills */}
      <div className={styles.typePills}>
        <button
          className={`${styles.pill} ${typeFilter === "all" ? styles.pillActive : ""}`}
          onClick={() => setTypeFilter("all")}
        >
          All Types
        </button>
        {MEASUREMENT_TYPES.map((t) => (
          <button
            key={t.id}
            className={`${styles.pill} ${typeFilter === t.id ? styles.pillActive : ""}`}
            onClick={() => setTypeFilter(t.id)}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* History list */}
      <div className={styles.historyCard}>
        <div className={styles.actions}>
          <button className={styles.refreshBtn} onClick={refresh}>
            ↺ Refresh
          </button>
        </div>
        <HistoryList history={displayed} loading={loading} />
      </div>
    </main>
  );
}
