# 🌦️ Weather Forecast

![React](https://img.shields.io/badge/React_19-20232A?style=flat&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat&logo=typescript&logoColor=white)
![Redux](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=flat&logo=redux&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
![SCSS](https://img.shields.io/badge/SCSS_Modules-CC6699?style=flat&logo=sass&logoColor=white)
![OpenWeather](https://img.shields.io/badge/OpenWeatherMap_API-EB6E4B?style=flat&logo=openweathermap&logoColor=white)

A weather dashboard built with **React**, **TypeScript** and **Redux Toolkit**.
It detects your location, shows the current weather, a scrollable hourly forecast and a 6-day forecast, and lets you search for any city and save your favourites. It comes with a light and a dark theme and switchable units.
Real weather data comes from the **OpenWeatherMap API**.

This is a personal pet project. I built the app and its logic myself; the visual design (the "Frosted Sky" look with light and dark themes) was created with Claude (Anthropic).

---

## 🔗 Live Preview

👉 **[Open the app](https://shtoikoihor.github.io/WeatherForecast/)**

---

## 🎨 Design Reference

[Figma — Weather App Design](https://www.figma.com/design/IDprcdwcpRkUL0eD12h9ER/Weather-App-Design)

---

## 🛠 Technologies Used

| Category | Tools |
|---|---|
| UI | React 19, TypeScript |
| State | Redux Toolkit (`createSlice`, `createAsyncThunk`), typed hooks |
| Routing | React Router (`BrowserRouter` with GitHub Pages SPA fallback) |
| Data | OpenWeatherMap API: Geocoding, Current Weather, 5-day / 3-hour Forecast |
| Browser APIs | Geolocation API, LocalStorage |
| Styles | SCSS Modules, skeleton loading animation |
| Build & deploy | Vite, gh-pages |
| Code quality | ESLint, typescript-eslint |

---

## ✨ Features

### 📍 Weather dashboard
- **Automatic location** — asks for geolocation and shows the weather where you are; if access is denied, falls back to Berlin
- **Current weather** — temperature, description, daily min / max and a weather icon
- **Hourly forecast** — the whole 5-day forecast in 3-hour steps, scrollable by touch, mouse drag, trackpad or arrow buttons
- **Pick an hour** — click any hour to see that time on the main card, with its description, humidity, wind and feels-like temperature; **Now** returns to the current weather
- **Daily forecast** — the coming days with min / max temperatures, calculated by grouping the 3-hour forecast by date; the icon is taken from the midday entry, with a range bar on a shared weekly scale; the day the hourly row is scrolled to is highlighted, and clicking a day scrolls the row to it
- **Metrics** — humidity, wind speed and "feels like" temperature
- **Light / dark theme** — follows the system setting until you choose one; the choice is remembered
- **Units** — °C / °F and m/s / km/h, remembered between visits
- **Local time** — forecast times and day boundaries use the time zone of the selected city
- **Loading and error states** — skeleton placeholders while data is loading and an error card if a request fails

### 🔍 City search
- Search for any city in the world through the OpenWeatherMap Geocoding API
- **Debounced input** — the request is sent 400 ms after you stop typing, so the API is not called on every keystroke
- Click a city to load its weather and return to the dashboard

### ⭐ Favourite cities
- Add or remove cities from favourites right in the search results
- Favourites are shown when the search field is empty, for quick access
- Saved in **LocalStorage** through a Redux slice, so they survive a page reload

---

## 🤝 How It Was Built

- **Built by me:** the project structure, the OpenWeatherMap integration (geocoding, current weather, forecast), the Redux Toolkit store with weather and favourites slices, geolocation with a fallback, debounced city search, favourites in LocalStorage, the first version of the UI and the deployment to GitHub Pages.
- **Designed with Claude:** the "Frosted Sky" visual design, including the light and dark themes, the glass cards and the responsive layout.
- **Added together with the redesign (implemented with Claude as a pair-programming assistant, then tested by me):** the °C / °F and m/s / km/h switch, picking an hour to show on the main card, the scrollable 5-day hourly row linked to the daily list, and local-time handling of the forecast.

---

## 🧠 What I Practised

- Structuring a Redux Toolkit store with separate slices for weather and favourites
- Handling async requests with `createAsyncThunk` and separate loading / error states
- Transforming raw API responses into typed data for the UI (`types/weather.ts`)
- Grouping and aggregating forecast data (`Math.min` / `Math.max` per day)
- Debouncing user input with `useEffect` + `setTimeout` cleanup
- Deploying a `BrowserRouter` app to GitHub Pages (Vite `base` + `404.html` fallback)

---

## 📁 Project Structure

```
src/
├── api/
│   └── weatherApi.ts         # API requests and data mapping
├── components/
│   ├── Header/               # current city and search button
│   ├── WeatherCard/          # reusable card: current, hourly, daily, metric, error
│   ├── HourlyForecast/
│   ├── DailyForecast/
│   ├── MetricsGrid/
│   └── Footer/
├── pages/
│   ├── WeatherDashboardPage.tsx
│   └── CitySearchPage.tsx
├── store/
│   ├── store.ts
│   ├── hooks.ts              # typed useAppDispatch / useAppSelector
│   ├── weatherSlice.ts       # current weather + forecast thunks
│   └── favouriteSlice.ts     # favourites + LocalStorage
├── types/
│   └── weather.ts
└── assets/                   # SVG icons
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- npm
- A free API key from [OpenWeatherMap](https://openweathermap.org/api)

### Installation

```bash
git clone https://github.com/shtoikoihor/WeatherForecast.git
cd WeatherForecast
npm install
```

### Environment variables

Create a `.env` file in the project root:

```env
VITE_WEATHER_API_KEY=your_api_key_here
```

### Run locally

```bash
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173/WeatherForecast/`).

### Other scripts

```bash
npm run build    # type check and production build
npm run lint     # check code style
npm run deploy   # publish to GitHub Pages
```

---

## 🔮 Possible Improvements

- UV index (not included in the free OpenWeatherMap endpoints)
- Weather-based background themes
- A search popover and a banner when location access is denied

---

