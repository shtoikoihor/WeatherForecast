import { useAppSelector } from "../../store/hooks";
import { WeatherCard } from "../WeatherCard/WeatherCard";
import styles from "./HourlyForecast.module.scss";

export const HourlyForecast = () => {
  const hourly = useAppSelector((state) => state.weather.hourly);
  const forecastError = useAppSelector((state) => state.weather.forecastError);

  if (forecastError) {
    return (
      <div className={styles.container}>
        <WeatherCard type="hourly" state="error" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {hourly.map((item) => (
        <WeatherCard
          key={item.currentTime}
          type="hourly"
          state="default"
          label={item.currentTime}
          temperature={item.temperature}
          kind={item.kind}
        />
      ))}
    </div>
  );
};
