import { useAppSelector } from "../../store/hooks";
import { formatTemp, formatWind } from "../../utils/units";
import { WeatherCard } from "../WeatherCard/WeatherCard";
import styles from "./MetricsGrid.module.scss";

export const MetricsGrid = () => {
  const data = useAppSelector((state) => state.weather.data);
  const currentError = useAppSelector((state) => state.weather.currentError);
  const { tempUnit, windUnit } = useAppSelector((state) => state.settings);

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

  const wind = formatWind(data.windSpeed, windUnit);

  // UV is not part of the free OpenWeatherMap endpoints, so there is no tile for it
  return (
    <div className={styles.container}>
      <WeatherCard
        type="metric"
        state="default"
        metricIcon="humidity"
        label="Humidity"
        value={`${data.humidity}`}
        unit="%"
      />

      <WeatherCard
        type="metric"
        state="default"
        metricIcon="wind"
        label="Wind"
        value={wind.value}
        unit={wind.unit}
      />

      <WeatherCard
        type="metric"
        state="default"
        metricIcon="feels"
        label="Feels like"
        value={formatTemp(data.tempFeels, tempUnit)}
      />
    </div>
  );
};
