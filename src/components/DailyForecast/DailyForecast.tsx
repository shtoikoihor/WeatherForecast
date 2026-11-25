import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { requestDay } from "../../store/weatherSlice";
import { WeatherCard } from "../WeatherCard/WeatherCard";
import styles from "./DailyForecast.module.scss";

export const DailyForecast = () => {
  const dispatch = useAppDispatch();
  const daily = useAppSelector((state) => state.weather.daily);
  const forecastError = useAppSelector((state) => state.weather.forecastError);
  const currentTemp = useAppSelector((state) => state.weather.data?.temperature);
  const focusedDay = useAppSelector((state) => state.weather.focusedDay);

  // one scale for the whole week so the bars are comparable between days
  const rangeMin = Math.min(...daily.map((item) => item.tempMin));
  const rangeMax = Math.max(...daily.map((item) => item.tempMax));

  // until the hourly row is scrolled, the first day is the one in focus
  const activeDay = focusedDay ?? daily[0]?.dayKey;

  return (
    <section className={styles.card} aria-label="Daily forecast">
      <h2 className={styles.title}>
        {forecastError ? "Daily" : `${daily.length} days`}
      </h2>
      <div className={styles.rows}>
        {forecastError ? (
          <WeatherCard type="daily" state="error" />
        ) : (
          daily.map((item, index) => {
            const isActive = item.dayKey === activeDay;

            return (
              <button
                key={item.dayKey}
                type="button"
                className={`${styles.day} ${isActive ? styles.dayActive : ""}`}
                aria-current={isActive ? "true" : undefined}
                aria-label={`Show hourly forecast for ${item.currentDay}`}
                onClick={() => dispatch(requestDay(item.dayKey))}
              >
                <WeatherCard
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
              </button>
            );
          })
        )}
      </div>
    </section>
  );
};
