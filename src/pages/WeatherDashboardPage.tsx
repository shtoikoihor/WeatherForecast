import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchCurrentWeather, fetchForecast } from "../store/weatherSlice";
import { Header } from "../components/Header/Header";
import { WeatherCard } from "../components/WeatherCard/WeatherCard";
import { HourlyForecast } from "../components/HourlyForecast/HourlyForecast";
import { DailyForecast } from "../components/DailyForecast/DailyForecast";
import { MetricsGrid } from "../components/MetricsGrid/MetricsGrid";

export const WeatherDashboardPage = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.weather.data);
  const loading = useAppSelector((state) => state.weather.loading);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      dispatch(fetchCurrentWeather({ lat: latitude, lon: longitude }));
      dispatch(fetchForecast({ lat: latitude, lon: longitude }));
    });
  }, []);

  return (
    <div>
      <Header />
      <WeatherCard
        type="current"
        state={loading ? "loading" : "default"}
        temperature={data?.temperature}
        description={data?.description}
        kind={data?.kind}
        tempMin={data?.tempMin}
        tempMax={data?.tempMax}
      />
      <HourlyForecast />
      <DailyForecast />
      <MetricsGrid />
    </div>
  );
};
