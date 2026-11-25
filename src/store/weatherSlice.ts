import { createSlice, createAsyncThunk, createSelector } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
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
  selectedHour: number | null;
}

const initialState: WeatherState = {
  selectedHour: null,
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
  reducers: {
    // index into `hourly`; null means "Now" (the real current weather)
    selectHour: (state, action: PayloadAction<number | null>) => {
      state.selectedHour = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentWeather.pending, (state) => {
        state.loading = true;
        state.currentError = null;
      })
      .addCase(fetchCurrentWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
        state.selectedHour = null;
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
        state.selectedHour = null;
      })
      .addCase(fetchForecast.rejected, (state, action) => {
        state.loading = false;
        state.forecastError = action.error.message ?? "Failed to load data";
      });
  },
});

export const { selectHour } = weatherSlice.actions;

export interface DisplayWeather extends WeatherData {
  // set when a forecast hour is selected, e.g. "Thursday, 01:00"
  caption?: string;
}

// what the hero and metrics show: the selected forecast hour, else current weather
export const selectDisplayWeather = createSelector(
  [
    (state: { weather: WeatherState }) => state.weather.data,
    (state: { weather: WeatherState }) => state.weather.hourly,
    (state: { weather: WeatherState }) => state.weather.selectedHour,
  ],
  (data, hourly, selectedHour): DisplayWeather | null => {
    if (!data) {
      return null;
    }

    const hour = selectedHour === null ? undefined : hourly[selectedHour];

    if (!hour) {
      return data;
    }

    return {
      ...data,
      temperature: hour.temperature,
      tempFeels: hour.tempFeels,
      tempMin: hour.tempMin,
      tempMax: hour.tempMax,
      description: hour.description,
      humidity: hour.humidity,
      windSpeed: hour.windSpeed,
      kind: hour.kind,
      caption: `${hour.dayName}, ${hour.currentTime}`,
    };
  },
);

export default weatherSlice.reducer;
