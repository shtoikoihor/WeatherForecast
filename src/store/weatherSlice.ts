import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type {
  DailyForecast,
  HourlyForecast,
  WeatherData,
} from "../types/weather";
import { getCurrentWeather, getForecast } from "../api/weatherApi";

interface WeatherState {
  data: WeatherData | null;
  hourly: HourlyForecast[];
  daily: DailyForecast[];
  loading: boolean;
  currentError: string | null;
  forecastError: string | null;
}

const initialState: WeatherState = {
  data: null,
  hourly: [],
  daily: [],
  loading: false,
  currentError: null,
  forecastError: null,
};

export const fetchCurrentWeather = createAsyncThunk(
  "weather/fetchCurrentWeather",
  async (coords: { lat: number; lon: number }) => {
    const data = await getCurrentWeather(coords.lat, coords.lon);
    return data;
  },
);

export const fetchForecast = createAsyncThunk(
  "weather/fetchForecast",
  async (coords: { lat: number; lon: number }) => {
    const data = await getForecast(coords.lat, coords.lon);

    return data;
  },
);

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentWeather.pending, (state) => {
        state.loading = true;
        state.currentError = null;
      })
      .addCase(fetchCurrentWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCurrentWeather.rejected, (state, action) => {
        state.loading = false;
        state.currentError = action.error.message ?? "Something went wrong!";
      })
      .addCase(fetchForecast.pending, (state) => {
        state.loading = true;
        state.forecastError = null;
      })
      .addCase(fetchForecast.fulfilled, (state, action) => {
        state.loading = false;
        state.hourly = action.payload.hourly;
        state.daily = action.payload.daily;
      })
      .addCase(fetchForecast.rejected, (state, action) => {
        state.loading = false;
        state.forecastError = action.error.message ?? "Failed to load data";
      });
  },
});

export default weatherSlice.reducer;
