import { useAppSelector } from "../../store/hooks";
import { WeatherCard } from "../WeatherCard/WeatherCard";
import styles from "./MetricsGrid.module.scss";

export const MetricsGrid = () => {
  const data = useAppSelector((state) => state.weather.data);
  const currentError = useAppSelector((state) => state.weather.currentError);

  if (currentError) {
    return (
      <div className={styles.container}>
        <WeatherCard type="metric" state="error" />
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className={styles.container}>
      <WeatherCard
        type="metric"
        state="default"
        metricIcon="humidity"
        label="Humidity"
        value={`${data.humidity}%`}
      />

      <WeatherCard
        type="metric"
        state="default"
        metricIcon="wind"
        label="Wind"
        value={`${data.windSpeed}`}
      />

      <WeatherCard
        type="metric"
        state="default"
        metricIcon="feels"
        label="Feels like"
        value={`${data.tempFeels.toFixed(0)}°`}
      />

      <WeatherCard
        type="metric"
        state="default"
        metricIcon="uv"
        label="UV"
        value="-"
      />
    </div>
  );
};
