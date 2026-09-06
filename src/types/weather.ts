export type WeatherKind = "sun" | "cloud" | "rain" | "partly";
export type WeatherCardType = "current" | "daily" | "hourly" | "metric";
export type WeatherCardState = "default" | "loading" | "error";
export type WeatherMetricIcon = "humidity" | "wind" | "feels" | "uv";

export interface WeatherData {
  temperature: number;
  tempFeels: number;
  tempMax: number;
  tempMin: number;
  condition: string;
  description: string;
  kind: WeatherKind;
  currentCity: string;
  humidity: number;
  windSpeed: number;
}

export interface HourlyForecast {
  currentTime: string;
  temperature: number;
  kind: WeatherKind;
}

export interface DailyForecast {
  currentDay: string;
  tempMin: number;
  tempMax: number;
  kind: WeatherKind;
}

export interface City {
  name: string;
  country: string;
  lat: number;
  lon: number;
}
