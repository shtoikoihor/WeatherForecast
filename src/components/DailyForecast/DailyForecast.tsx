import { useAppSelector } from "../../store/hooks";
import { WeatherCard } from "../WeatherCard/WeatherCard";
import styles from "./DailyForecast.module.scss";

export const DailyForecast = () => {
  const daily = useAppSelector((state) => state.weather.daily);
  const forecastError = useAppSelector((state) => state.weather.forecastError);

  if (forecastError) {
    return (
      <div className={styles.container}>
        <WeatherCard type="daily" state="error" />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {daily.map((item) => (
        <WeatherCard
          key={item.currentDay}
          type="daily"
          state="default"
          label={item.currentDay}
          tempMax={item.tempMax}
          tempMin={item.tempMin}
          kind={item.kind}
        />
      ))}
    </div>
  );
};
