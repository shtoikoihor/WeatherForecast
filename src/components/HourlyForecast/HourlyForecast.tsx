import { Fragment } from "react";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { selectHour } from "../../store/weatherSlice";
import { WeatherCard } from "../WeatherCard/WeatherCard";
import styles from "./HourlyForecast.module.scss";

export const HourlyForecast = () => {
  const dispatch = useAppDispatch();
  const hourly = useAppSelector((state) => state.weather.hourly);
  const forecastError = useAppSelector((state) => state.weather.forecastError);
  const selectedHour = useAppSelector((state) => state.weather.selectedHour);

  return (
    <section className={styles.card} aria-label="Hourly forecast">
      <h2 className={styles.title}>Hourly</h2>
      <div className={styles.strip}>
        {forecastError ? (
          <WeatherCard type="hourly" state="error" />
        ) : (
          hourly.map((item, index) => {
            // the first card is "Now" (real current weather); the rest are forecast hours
            const value = index === 0 ? null : index;
            const isSelected = selectedHour === value;

            return (
              <Fragment key={`${item.dayName}-${item.currentTime}`}>
                {index > 0 && item.currentTime === "00:00" && (
                  <div className={styles.divider}>
                    <span className={styles.dividerLabel}>
                      {item.dayName.slice(0, 3)}
                    </span>
                    <span className={styles.dividerLine} />
                  </div>
                )}
                <button
                  type="button"
                  className={styles.item}
                  aria-pressed={isSelected}
                  aria-label={`${index === 0 ? "Now" : `${item.dayName} ${item.currentTime}`}, show weather`}
                  onClick={() => dispatch(selectHour(value))}
                >
                  <WeatherCard
                    type="hourly"
                    state="default"
                    label={index === 0 ? "Now" : item.currentTime}
                    temperature={item.temperature}
                    kind={item.kind}
                    isSelected={isSelected}
                  />
                </button>
              </Fragment>
            );
          })
        )}
      </div>
    </section>
  );
};
