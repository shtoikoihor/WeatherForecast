import type { TempUnit, WindUnit } from "../store/settingsSlice";

// the API is always asked for metric (°C, m/s); convert only for display
export const toDisplayTemp = (celsius: number, unit: TempUnit): number =>
  unit === "F" ? (celsius * 9) / 5 + 32 : celsius;

export const formatTemp = (
  celsius: number | undefined,
  unit: TempUnit,
): string => {
  if (celsius === undefined) {
    return "-";
  }

  return `${Math.round(toDisplayTemp(celsius, unit))}°`;
};

export const formatWind = (
  metersPerSecond: number,
  unit: WindUnit,
): { value: string; unit: string } => {
  if (unit === "kmh") {
    return { value: (metersPerSecond * 3.6).toFixed(1), unit: "km/h" };
  }

  return { value: metersPerSecond.toFixed(1), unit: "m/s" };
};
