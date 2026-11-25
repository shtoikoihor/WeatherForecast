import { useAppSelector } from "../../store/hooks";
import { WeatherCard } from "../WeatherCard/WeatherCard";
import styles from "./DailyForecast.module.scss";

export const DailyForecast = () => {
  const daily = useAppSelector((state) => state.weather.daily);
  const forecastError = useAppSelector((state) => state.weather.forecastError);
  const currentTemp = useAppSelector((state) => state.weather.data?.temperature);

  // one scale for the whole week so the bars are comparable between days
  const rangeMin = Math.min(...daily.map((item) => item.tempMin));
  const rangeMax = Math.max(...daily.map((item) => item.tempMax));

  return (
    <section className={styles.card} aria-label="Daily forecast">
      <h2 className={styles.title}>
        {forecastError ? "Daily" : `${daily.length} days`}
      </h2>
      <div className={styles.rows}>
        {forecastError ? (
          <WeatherCard type="daily" state="error" />
        ) : (
          daily.map((item, index) => (
            <WeatherCard
              key={item.currentDay}
              type="daily"
              state="default"
              label={item.currentDay}
              tempMax={item.tempMax}
              tempMin={item.tempMin}
              kind={item.kind}
              rangeMin={rangeMin}
              rangeMax={rangeMax}
              marker={index === 0 ? currentTemp : undefined}
            />
          ))
        )}
      </div>
    </section>
  );
};
