import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { fetchCurrentWeather, fetchForecast } from "../store/weatherSlice";
import { Header } from "../components/Header/Header";
import { WeatherCard } from "../components/WeatherCard/WeatherCard";
import { HourlyForecast } from "../components/HourlyForecast/HourlyForecast";
import { DailyForecast } from "../components/DailyForecast/DailyForecast";
import { MetricsGrid } from "../components/MetricsGrid/MetricsGrid";
import styles from "./WeatherDashboardPage.module.scss";
import { Footer } from "../components/Footer/Footer";

export const WeatherDashboardPage = () => {
  const dispatch = useAppDispatch();
  const data = useAppSelector((state) => state.weather.data);
  const loading = useAppSelector((state) => state.weather.loading);
  const currentError = useAppSelector((state) => state.weather.currentError);

  useEffect(() => {
    if (data) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        dispatch(fetchCurrentWeather({ lat: latitude, lon: longitude }));
        dispatch(fetchForecast({ lat: latitude, lon: longitude }));
      },
      () => {
        dispatch(fetchCurrentWeather({ lat: 52.52, lon: 13.405 }));
        dispatch(fetchForecast({ lat: 52.52, lon: 13.405 }));
      },
    );
  }, [data, dispatch]);

  if (loading) {
    return (
      <div className={styles.loadingPage}>
        <div className={`${styles.skeleton} ${styles.skeletonHeader}`} />
        <div className={`${styles.skeleton} ${styles.skeletonMain}`} />
      </div>
    );
  }

  // the metrics render twice: inside the hero card on desktop, below the
  // forecast on smaller screens; CSS shows exactly one of them
  return (
    <div className={styles.page}>
      <Header />
      <main className={styles.body}>
        <section className={styles.hero} aria-label="Current weather">
          <div className={styles.heroMain}>
            <WeatherCard
              type="current"
              state={currentError ? "error" : "default"}
              temperature={data?.temperature}
              description={data?.description}
              kind={data?.kind}
              tempMin={data?.tempMin}
              tempMax={data?.tempMax}
            />
          </div>
          <div className={styles.heroMetrics}>
            <MetricsGrid />
          </div>
        </section>
        <div className={styles.forecast}>
          <HourlyForecast />
          <DailyForecast />
        </div>
        <div className={styles.metricsBelow}>
          <MetricsGrid />
        </div>
      </main>
      <Footer />
    </div>
  );
};
