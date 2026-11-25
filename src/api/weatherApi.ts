import type {
  City,
  DailyForecast,
  HourlyForecast,
  WeatherData,
  WeatherKind,
} from "../types/weather";

const BASE_URL = "https://api.openweathermap.org";
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

interface ForecastItem {
  dt: number;
  main: { temp: number; feels_like: number; humidity: number };
  weather: { icon: string; description: string }[];
  wind: { speed: number };
}

interface ForecastResponse {
  list: ForecastItem[];
  city: { timezone: number };
}

export const getWeatherKind = (icon: string): WeatherKind => {
  const code = icon.slice(0, 2);

  if (code === "01") {
    return "sun";
  }

  if (code === "02") {
    return "partly";
  }

  if (code === "03" || code === "04") {
    return "cloud";
  }

  if (code === "09" || code === "10" || code === "11") {
    return "rain";
  }

  return "cloud";
};

export const searchCities = async (query: string): Promise<City[]> => {
  const response = await fetch(
    `${BASE_URL}/geo/1.0/direct?q=${encodeURIComponent(query)}&limit=5&appid=${API_KEY}`,
  );

  if (!response.ok) {
    throw new Error("City search failed");
  }

  const data = await response.json();

  return data;
};

export const getCurrentWeather = async (
  lat: number,
  lon: number,
): Promise<WeatherData> => {
  const response = await fetch(
    `${BASE_URL}/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
  );

  if (!response.ok) {
    throw new Error("Weather search failed");
  }

  const data = await response.json();

  const weatherData: WeatherData = {
    temperature: data.main.temp,
    tempFeels: data.main.feels_like,
    tempMin: data.main.temp_min,
    tempMax: data.main.temp_max,
    condition: data.weather[0].main,
    description: data.weather[0].description,
    currentCity: data.name,
    kind: getWeatherKind(data.weather[0].icon),
    humidity: data.main.humidity,
    windSpeed: data.wind.speed,
  };

  return weatherData;
};

export const getForecast = async (
  lat: number,
  lon: number,
): Promise<{
  hourly: HourlyForecast[];
  daily: DailyForecast[];
}> => {
  const response = await fetch(
    `${BASE_URL}/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`,
  );

  if (!response.ok) {
    throw new Error("Forecast search failed");
  }

  const data: ForecastResponse = await response.json();
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const pad = (n: number) => String(n).padStart(2, "0");

  // dt is UTC; shift by the city's offset so times and day boundaries are local
  const toLocal = (dt: number) => {
    const date = new Date((dt + data.city.timezone) * 1000);

    return {
      day: `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`,
      time: `${pad(date.getUTCHours())}:${pad(date.getUTCMinutes())}`,
      weekday: dayNames[date.getUTCDay()],
    };
  };

  const items = data.list.map((item) => ({ item, local: toLocal(item.dt) }));

  const grouped = new Map<string, typeof items>();

  items.forEach((entry) => {
    const group = grouped.get(entry.local.day) ?? [];

    group.push(entry);
    grouped.set(entry.local.day, group);
  });

  const hourly: HourlyForecast[] = items.map(({ item, local }) => {
    const dayTemps = (grouped.get(local.day) ?? []).map(
      (entry) => entry.item.main.temp,
    );

    return {
      currentTime: local.time,
      dayName: local.weekday,
      dayKey: local.day,
      temperature: item.main.temp,
      tempFeels: item.main.feels_like,
      // the slot has no real min/max, so show the range of its day
      tempMin: Math.min(...dayTemps),
      tempMax: Math.max(...dayTemps),
      description: item.weather[0].description,
      humidity: item.main.humidity,
      windSpeed: item.wind.speed,
      kind: getWeatherKind(item.weather[0].icon),
    };
  });

  const daily: DailyForecast[] = [...grouped.values()].map((group, index) => {
    const temps = group.map(({ item }) => item.main.temp);
    const noonEntry = group.find(({ local }) => local.time === "12:00");
    const iconSource = (noonEntry ?? group[0]).item;

    return {
      dayKey: group[0].local.day,
      currentDay: index === 0 ? "Today" : group[0].local.weekday,
      tempMin: Math.min(...temps),
      tempMax: Math.max(...temps),
      kind: getWeatherKind(iconSource.weather[0].icon),
    };
  });

  return { hourly, daily };
};
