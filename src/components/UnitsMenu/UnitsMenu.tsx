import { useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import {
  setTempUnit,
  setWindUnit,
  type TempUnit,
  type WindUnit,
} from "../../store/settingsSlice";
import styles from "./UnitsMenu.module.scss";

const TEMP_OPTIONS: { value: TempUnit; label: string }[] = [
  { value: "C", label: "°C" },
  { value: "F", label: "°F" },
];

const WIND_OPTIONS: { value: WindUnit; label: string }[] = [
  { value: "ms", label: "m/s" },
  { value: "kmh", label: "km/h" },
];

export const UnitsMenu = () => {
  const dispatch = useAppDispatch();
  const { tempUnit, windUnit } = useAppSelector((state) => state.settings);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const windLabel = WIND_OPTIONS.find((option) => option.value === windUnit)?.label;

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        type="button"
        className={styles.pill}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Units"
        onClick={() => setOpen((value) => !value)}
      >
        °{tempUnit}
        <span className={styles.pillWind}> · {windLabel}</span>
      </button>

      {open && (
        <div className={styles.popover} role="dialog" aria-label="Units">
          <div className={styles.row}>
            <span className={styles.rowLabel}>Temperature</span>
            <div className={styles.segmented} role="radiogroup" aria-label="Temperature">
              {TEMP_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={tempUnit === option.value}
                  className={styles.segment}
                  onClick={() => dispatch(setTempUnit(option.value))}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.row}>
            <span className={styles.rowLabel}>Wind</span>
            <div className={styles.segmented} role="radiogroup" aria-label="Wind speed">
              {WIND_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={windUnit === option.value}
                  className={styles.segment}
                  onClick={() => dispatch(setWindUnit(option.value))}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
