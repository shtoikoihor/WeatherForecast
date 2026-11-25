import { Fragment } from "react";
import { useAppSelector } from "../../store/hooks";
import { WeatherCard } from "../WeatherCard/WeatherCard";
import styles from "./HourlyForecast.module.scss";

export const HourlyForecast = () => {
  const hourly = useAppSelector((state) => state.weather.hourly);
  const forecastError = useAppSelector((state) => state.weather.forecastError);

  return (
    <section className={styles.card} aria-label="Hourly forecast">
      <h2 className={styles.title}>Hourly</h2>
      <div className={styles.strip}>
        {forecastError ? (
          <WeatherCard type="hourly" state="error" />
        ) : (
          hourly.map((item, index) => (
            <Fragment key={`${item.dayName}-${item.currentTime}`}>
              {index > 0 && item.currentTime === "00:00" && (
                <div className={styles.divider}>
                  <span className={styles.dividerLabel}>
                    {item.dayName.slice(0, 3)}
                  </span>
                  <span className={styles.dividerLine} />
                </div>
              )}
              <WeatherCard
                type="hourly"
                state="default"
                label={index === 0 ? "Now" : item.currentTime}
                temperature={item.temperature}
                kind={item.kind}
                isNow={index === 0}
              />
            </Fragment>
          ))
        )}
      </div>
    </section>
  );
};
