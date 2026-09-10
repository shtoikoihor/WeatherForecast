import "./App.scss";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { WeatherDashboardPage } from "./pages/WeatherDashboardPage";
import { CitySearchPage } from "./pages/CitySearchPage";

function App() {
  return (
    <BrowserRouter basename="/WeatherForecast">
      <Routes>
        <Route path="/" element={<WeatherDashboardPage />} />
        <Route path="/search" element={<CitySearchPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
