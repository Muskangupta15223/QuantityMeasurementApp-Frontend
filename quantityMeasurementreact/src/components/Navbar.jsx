import styles from "./Navbar.module.css";

/**
 * Navbar receives auth state + navigation callbacks via props.
 * Kept pure — no internal hooks — so it's easy to test.
 */
export default function Navbar({ page, onNavigate, user, onLogin, onLogout }) {
  return (
    <nav className={styles.nav}>
      <button className={styles.logo} onClick={() => onNavigate("dashboard")}>
        QuantityMeasurement
      </button>

      <div className={styles.links}>
        <button
          className={`${styles.navBtn} ${page === "dashboard" ? styles.active : styles.ghost}`}
          onClick={() => onNavigate("dashboard")}
        >
          Dashboard
        </button>

        <button
          className={`${styles.navBtn} ${page === "history" ? styles.active : styles.ghost}`}
          onClick={() => onNavigate("history")}
        >
          History
        </button>

        {user ? (
          <div className={styles.userChip}>
            <div className={styles.avatar} title={user.email}>
              {user.email[0].toUpperCase()}
            </div>
            <button
              className={`${styles.navBtn} ${styles.ghost}`}
              onClick={onLogout}
            >
              Sign Out
            </button>
          </div>
        ) : (
          <button
            className={`${styles.navBtn} ${styles.primary}`}
            onClick={onLogin}
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  );
}
