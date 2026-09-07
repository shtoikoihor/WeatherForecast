import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchCurrentWeather, fetchForecast } from "../store/weatherSlice";
import { Header } from "../components/Header/Header";
import { WeatherCard } from "../components/WeatherCard/WeatherCard";
import { HourlyForecast } from "../components/HourlyForecast/HourlyForecast";
import { DailyForecast } from "../components/DailyForecast/DailyForecast";
import { MetricsGrid } from "../components/MetricsGrid/MetricsGrid";
import styles from "./WeatherDashboardPage.module.scss";

export const WeatherDashboardPage = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.weather.data);
  const loading = useAppSelector((state) => state.weather.loading);
  const currentError = useAppSelector((state) => state.weather.currentError);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      dispatch(fetchCurrentWeather({ lat: latitude, lon: longitude }));
      dispatch(fetchForecast({ lat: latitude, lon: longitude }));
    });
  }, []);

  if (loading) {
    return (
      <div className={styles.loadingPage}>
        <div className={`${styles.skeleton} ${styles.skeletonHeader}`} />
        <div className={`${styles.skeleton} ${styles.skeletonMain}`} />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <WeatherCard
        type="current"
        state={currentError ? "error" : "default"}
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
