import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { setTheme } from "../../store/settingsSlice";
import styles from "./ThemeToggle.module.scss";

export const ThemeToggle = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.settings.theme);
  const isDark = theme === "dark";

  const handleClick = () => {
    const next = isDark ? "light" : "dark";

    // index.html reads data-theme before first paint; keep it in step with the store
    document.documentElement.setAttribute("data-theme", next);
    dispatch(setTheme(next));
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      aria-label="Dark theme"
      className={styles.button}
      onClick={handleClick}
    >
      {isDark ? (
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 3.5v2M12 18.5v2M3.5 12h2M18.5 12h2M6 6l1.3 1.3M16.7 16.7L18 18M18 6l-1.3 1.3M7.3 16.7L6 18" />
        </svg>
      ) : (
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
        </svg>
      )}
    </button>
  );
};
