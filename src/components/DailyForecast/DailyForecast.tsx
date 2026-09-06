import { useAppSelector } from "../../store/hooks";
import { WeatherCard } from "../WeatherCard/WeatherCard";

export const DailyForecast = () => {
  const daily = useAppSelector((state) => state.weather.daily);

  return (
    <div>
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
