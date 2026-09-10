import { createSlice } from "@reduxjs/toolkit";
import type { City } from "../types/weather";

interface FavouritesState {
  cities: City[];
}

const loadFavourites = (): City[] => {
  const saved = localStorage.getItem("favourites");

  if (saved === null) {
    return [];
  }

  return JSON.parse(saved);
};

const initialState: FavouritesState = {
  cities: loadFavourites(),
};

const favouritesSlice = createSlice({
  name: "favourites",
  initialState,
  reducers: {
    addFavourite: (state, action) => {
      state.cities.push(action.payload);
      localStorage.setItem("favourites", JSON.stringify(state.cities));
    },

    removeFavourite: (state, action) => {
      state.cities = state.cities.filter((city) => {
        return (
          city.lat !== action.payload.lat || city.lon !== action.payload.lon
        );
      });

      localStorage.setItem("favourites", JSON.stringify(state.cities));
    },
  },
});

export const { addFavourite, removeFavourite } = favouritesSlice.actions;
export default favouritesSlice.reducer;
