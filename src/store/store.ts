import { configureStore } from "@reduxjs/toolkit";
import weatherReducer from "./weatherSlice";
import favouritesReducer from "./favouriteSlice";
import settingsReducer from "./settingsSlice";

export const store = configureStore({
  reducer: {
    weather: weatherReducer,
    favourites: favouritesReducer,
    settings: settingsReducer,
  },
});

// persist the user's choices; the theme is stored only once they pick one,
// until then the system preference decides (see index.html)
let lastTheme = store.getState().settings.theme;

store.subscribe(() => {
  const { theme, tempUnit, windUnit } = store.getState().settings;

  try {
    localStorage.setItem("units", JSON.stringify({ tempUnit, windUnit }));

    if (theme !== lastTheme) {
      lastTheme = theme;
      localStorage.setItem("theme", theme);
    }
  } catch {
    // storage can be blocked; the app still works for this session
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
