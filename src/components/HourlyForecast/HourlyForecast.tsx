import { useAppSelector } from "../../store/hooks";
import { WeatherCard } from "../WeatherCard/WeatherCard";

export const HourlyForecast = () => {
  const hourly = useAppSelector((state) => state.weather.hourly);

  return (
    <div>
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
