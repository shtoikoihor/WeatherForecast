//#region imports
import type { CSSProperties } from "react";
import type {
  WeatherCardState,
  WeatherCardType,
  WeatherKind,
  WeatherMetricIcon,
} from "../../types/weather";
import { useAppSelector } from "../../store/hooks";
import { formatTemp } from "../../utils/units";
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
  unit?: string;
  description?: string;
  metricIcon?: WeatherMetricIcon;
  // current: shown above the icon when a forecast hour is displayed
  caption?: string;
  // hourly: highlight the chosen item
  isSelected?: boolean;
  // daily: week-wide scale (°C) for the range bar, and the current temp marker
  rangeMin?: number;
  rangeMax?: number;
  marker?: number;
}
//#endregion

//#region transformation
const capitalizeFirst = (text: string | undefined): string => {
  if (text === undefined) {
    return "-";
  }

  return text.charAt(0).toUpperCase() + text.slice(1);
};

const percent = (value: number, min: number, span: number): number =>
  ((value - min) / span) * 100;

const getBarStyle = (
  tempMin: number,
  tempMax: number,
  rangeMin: number,
  rangeMax: number,
): CSSProperties => {
  const span = rangeMax - rangeMin || 1;
  const width = Math.max(8, percent(tempMax, tempMin, span));
  const left = Math.min(percent(tempMin, rangeMin, span), 100 - width);

  return { left: `${left}%`, width: `${width}%` };
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
  unit,
  description,
  metricIcon,
  caption,
  isSelected = false,
  rangeMin,
  rangeMax,
  marker,
}: WeatherCardProps) => {
  const tempUnit = useAppSelector((appState) => appState.settings.tempUnit);
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
        {caption && <span className={styles.caption}>{caption}</span>}
        <img className={styles.currentIcon} src={iconSrc} alt={description} />
        <span className={styles.temperature}>
          {formatTemp(temperature, tempUnit)}
        </span>
        <span className={styles.description}>
          {capitalizeFirst(description)}
        </span>
        <div className={styles.minMax}>
          <span>↓{formatTemp(tempMin, tempUnit)}</span>
          <span className={styles.minMaxHigh}>
            ↑{formatTemp(tempMax, tempUnit)}
          </span>
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
      <div
        className={`${styles.hourlyContainer} ${isSelected ? styles.hourlySelected : ""}`}
      >
        <span className={styles.hourlyLabel}>{label}</span>
        <img className={styles.hourlyIcons} src={iconSrc} alt={kind} />
        <span className={styles.hourlyTemp}>
          {formatTemp(temperature, tempUnit)}
        </span>
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

    const hasRange =
      tempMin !== undefined && tempMax !== undefined && rangeMin !== undefined;
    const span = hasRange && rangeMax !== undefined ? rangeMax - rangeMin || 1 : 1;

    return (
      <div className={styles.dailyRow}>
        <span className={styles.dailyDay}>{label}</span>
        <img className={styles.dailyIcon} src={iconSrc} alt={kind} />
        <span className={styles.dailyTempMin}>
          {formatTemp(tempMin, tempUnit)}
        </span>
        <div className={styles.dailyTrack}>
          {hasRange && rangeMax !== undefined && (
            <div
              className={styles.dailyFill}
              style={getBarStyle(tempMin, tempMax, rangeMin, rangeMax)}
            />
          )}
          {hasRange && marker !== undefined && (
            <div
              className={styles.dailyMarker}
              style={{
                left: `${Math.min(100, Math.max(0, percent(marker, rangeMin, span)))}%`,
              }}
            />
          )}
        </div>
        <span className={styles.dailyTempMax}>
          {formatTemp(tempMax, tempUnit)}
        </span>
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
        <span className={styles.metricValueRow}>
          <span className={styles.metricValue}>{value}</span>
          {unit && <span className={styles.metricUnit}>{unit}</span>}
        </span>
      </div>
    );
  }

  return null;
};
