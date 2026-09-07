import type {
  City,
  DailyForecast,
  HourlyForecast,
  WeatherData,
  WeatherKind,
} from "../types/weather";

const BASE_URL = "https://api.openweathermap.org";
const API_KEY = import.meta.env.VITE_WEATHER_API_KEY;

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
    `${BASE_URL}/geo/1.0/direct?q=${query}&limit=5&appid=${API_KEY}`,
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

  const data = await response.json();
  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const hourly: HourlyForecast[] = data.list.slice(0, 8).map((item: any) => {
    const [, time] = item.dt_txt.split(" ");

    return {
      currentTime: time.slice(0, 5),
      temperature: item.main.temp,
      kind: getWeatherKind(item.weather[0].icon),
    };
  });

  const grouped: Record<string, any[]> = {};

  data.list.forEach((item: any) => {
    const [date] = item.dt_txt.split(" ");

    if (!grouped[date]) {
      grouped[date] = [];
    }

    grouped[date].push(item);
  });

  const dates = Object.keys(grouped);
  const daily: DailyForecast[] = dates.map((date) => {
    const group = grouped[date];
    const temps = group.map((item) => item.main.temp);

    const tempMin = Math.min(...temps);
    const tempMax = Math.max(...temps);

    const noonEntry = group.find((item) => item.dt_txt.includes("12:00:00"));
    const iconSource = noonEntry ?? group[0];

    return {
      currentDay: dayNames[new Date(date).getDay()],
      tempMin,
      tempMax,
      kind: getWeatherKind(iconSource.weather[0].icon),
    };
  });

  return { hourly, daily };
};
