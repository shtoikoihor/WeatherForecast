import { useAppSelector } from "../../store/hooks";
import { WeatherCard } from "../WeatherCard/WeatherCard";

export const MetricsGrid = () => {
  const data = useAppSelector((state) => state.weather.data);

  if (!data) {
    return null;
  }

  return (
    <div>
      <WeatherCard
        type="metric"
        state="default"
        metricIcon="humidity"
        label="Вологість"
        value={`${data.humidity}%`}
      />

      <WeatherCard
        type="metric"
        state="default"
        metricIcon="wind"
        label="Вітряно"
        value={`${data.windSpeed}`}
      />

      <WeatherCard
        type="metric"
        state="default"
        metricIcon="feels"
        label="Відчувається як"
        value={`${data.tempFeels}`}
      />

      <WeatherCard
        type="metric"
        state="default"
        metricIcon="uv"
        label="UV"
        value="-"
      />
    </div>
  );
};
