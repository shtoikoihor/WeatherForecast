import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export type Theme = "light" | "dark";
export type TempUnit = "C" | "F";
export type WindUnit = "ms" | "kmh";

interface SettingsState {
  theme: Theme;
  tempUnit: TempUnit;
  windUnit: WindUnit;
}

// index.html already set data-theme before first paint, so read it back
const readTheme = (): Theme =>
  document.documentElement.getAttribute("data-theme") === "dark"
    ? "dark"
    : "light";

const readUnits = (): Pick<SettingsState, "tempUnit" | "windUnit"> => {
  const fallback = { tempUnit: "C", windUnit: "ms" } as const;

  try {
    const saved = localStorage.getItem("units");

    if (saved === null) {
      return fallback;
    }

    const parsed = JSON.parse(saved);

    return {
      tempUnit: parsed.tempUnit === "F" ? "F" : "C",
      windUnit: parsed.windUnit === "kmh" ? "kmh" : "ms",
    };
  } catch {
    return fallback;
  }
};

const initialState: SettingsState = {
  theme: readTheme(),
  ...readUnits(),
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
    },
    setTempUnit: (state, action: PayloadAction<TempUnit>) => {
      state.tempUnit = action.payload;
    },
    setWindUnit: (state, action: PayloadAction<WindUnit>) => {
      state.windUnit = action.payload;
    },
  },
});

export const { setTheme, setTempUnit, setWindUnit } = settingsSlice.actions;
export default settingsSlice.reducer;
