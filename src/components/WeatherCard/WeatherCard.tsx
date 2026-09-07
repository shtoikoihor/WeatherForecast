//#region  imports
import type {
  WeatherCardState,
  WeatherCardType,
  WeatherKind,
  WeatherMetricIcon,
} from "../../types/weather";
import sunIcon from "../../assets/icons/sun.svg";
import cloudIcon from "../../assets/icons/cloud.svg";
import rainIcon from "../../assets/icons/rain.svg";
import partlyIcon from "../../assets/icons/partly.svg";
import humidityIcon from "../../assets/metric-icons/humidity.svg";
import windIcon from "../../assets/metric-icons/wind.svg";
import feelsIcon from "../../assets/metric-icons/feels.svg";
import uvIcon from "../../assets/metric-icons/uv.svg";
import errorIcon from "../../assets/error/error.svg";
import styles from "./WeatherCard.module.scss";
//#endregion

//#region interfaces and records
const weatherIcons: Record<WeatherKind, string> = {
  sun: sunIcon,
  partly: partlyIcon,
  cloud: cloudIcon,
  rain: rainIcon,
};

const weatherMetricIcons: Record<WeatherMetricIcon, string> = {
  humidity: humidityIcon,
  wind: windIcon,
  feels: feelsIcon,
  uv: uvIcon,
};

interface WeatherCardProps {
  type: WeatherCardType;
  state: WeatherCardState;
  temperature?: number;
  tempMin?: number;
  tempMax?: number;
  kind?: WeatherKind;
  label?: string;
  value?: string;
  description?: string;
  metricIcon?: WeatherMetricIcon;
}
//#endregion

//#region transformation
const formatTemp = (temp: number | undefined): string => {
  if (temp === undefined) {
    return "-";
  }

  return `${Math.round(temp)}°`;
};

const capitalizeFirst = (text: string | undefined): string => {
  if (text === undefined) {
    return "-";
  }

  return text.charAt(0).toUpperCase() + text.slice(1);
};
//#endregion

export const WeatherCard = ({
  type,
  state,
  temperature,
  tempMin,
  tempMax,
  kind,
  label,
  value,
  description,
  metricIcon,
}: WeatherCardProps) => {
  const iconSrc = kind ? weatherIcons[kind] : undefined;
  const metricIconSrc = metricIcon ? weatherMetricIcons[metricIcon] : undefined;

  if (type === "current") {
    if (state === "loading") {
      return (
        <div className={styles.currentCard}>
          <div className={`${styles.skeleton} ${styles.skeletonIcon}`} />
          <div className={`${styles.skeleton} ${styles.skeletonText}`} />
        </div>
      );
    }

    if (state === "error") {
      return (
        <div className={styles.currentCard}>
          <img
            className={styles.currentErrorIcon}
            src={errorIcon}
            alt="error"
          />
          <p className={styles.currentErrorText}>Failed to load data</p>
        </div>
      );
    }

    return (
      <div className={styles.currentCard}>
        <img className={styles.currentIcon} src={iconSrc} alt={description} />
        <span className={styles.temperature}>{formatTemp(temperature)}</span>
        <span className={styles.description}>
          {capitalizeFirst(description)}
        </span>
        <div className={styles.minMax}>
          <span>↓{formatTemp(tempMin)}</span>
          <span>↑{formatTemp(tempMax)}</span>
        </div>
      </div>
    );
  }

  if (type === "hourly") {
    if (state === "loading") {
      return (
        <div className={styles.hourlyContainer}>
          <div className={`${styles.skeleton} ${styles.skeletonHourlyText}`} />
          <div className={`${styles.skeleton} ${styles.skeletonHourlyIcon}`} />
          <div className={`${styles.skeleton} ${styles.skeletonHourlyText}`} />
        </div>
      );
    }

    if (state === "error") {
      return (
        <div className={styles.hourlyContainer}>
          <span className={styles.hourlyLabel}>{label}</span>
          <img className={styles.hourlyErrorIcon} src={errorIcon} alt="error" />
          <span className={styles.hourlyErrorText}>Error</span>
        </div>
      );
    }

    return (
      <div className={styles.hourlyContainer}>
        <span className={styles.hourlyLabel}>{label}</span>
        <img className={styles.hourlyIcons} src={iconSrc} alt={kind} />
        <span className={styles.hourlyTemp}>{formatTemp(temperature)}</span>
      </div>
    );
  }

  if (type === "daily") {
    if (state === "loading") {
      return (
        <div className={styles.dailyRow}>
          <div className={`${styles.skeleton} ${styles.skeletonDailyRow}`} />
        </div>
      );
    }

    if (state === "error") {
      return (
        <div className={styles.dailyRow}>
          <span className={styles.dailyDay}>{label}</span>
          <img className={styles.dailyErrorIcon} src={errorIcon} alt="error" />
          <span className={styles.dailyErrorText}>Failed to load</span>
        </div>
      );
    }

    return (
      <div className={styles.dailyRow}>
        <span className={styles.dailyDay}>{label}</span>
        <img className={styles.dailyIcon} src={iconSrc} alt={kind} />
        <div className={styles.dailyTemps}>
          <span className={styles.dailyTempMin}>{formatTemp(tempMin)}</span>
          <span className={styles.dailyTempMax}>{formatTemp(tempMax)}</span>
        </div>
      </div>
    );
  }

  if (type === "metric") {
    if (state === "loading") {
      return (
        <div className={styles.metricCard}>
          <div className={`${styles.skeleton} ${styles.skeletonMetricIcon}`} />
          <div className={`${styles.skeleton} ${styles.skeletonMetricText}`} />
        </div>
      );
    }

    if (state === "error") {
      return (
        <div className={styles.metricCard}>
          <img className={styles.metricErrorIcon} src={errorIcon} alt="error" />
          <span className={styles.metricLabel}>{label}</span>
          <span className={styles.metricErrorText}>Failed to load</span>
        </div>
      );
    }

    return (
      <div className={styles.metricCard}>
        <img className={styles.metricIcon} src={metricIconSrc} alt={label} />
        <span className={styles.metricLabel}>{label}</span>
        <span className={styles.metricValue}>{value}</span>
      </div>
    );
  }

  return null;
};
