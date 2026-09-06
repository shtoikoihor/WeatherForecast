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

  if (state === "loading") {
    return (
      <div className={styles.loadingCard}>
        <div className={`${styles.skeleton} ${styles.skeletonIcon}`} />
        <div className={`${styles.skeleton} ${styles.skeletonText}`} />
      </div>
    );
  }

  if (state === "error") {
    return <div>Ой... Помилка!</div>;
  }

  if (type === "daily") {
    return (
      <div>
        <img src={iconSrc} alt={kind} />
        {label} {formatTemp(tempMin)} / {formatTemp(tempMax)}
      </div>
    );
  }

  if (type === "current") {
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
    return (
      <>
        <div className={styles.hourlyContainer}>
          <img className={styles.hourlyIcons} src={iconSrc} alt={kind} />
          {label} {formatTemp(temperature)}
        </div>
      </>
    );
  }

  if (type === "metric") {
    return (
      <div>
        <img src={metricIconSrc} alt={label} />
        {label} {value}
      </div>
    );
  }

  return null;
};
