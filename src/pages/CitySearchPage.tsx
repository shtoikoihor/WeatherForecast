import { useAppDispatch, useAppSelector } from "../store/hooks";
import { useNavigate } from "react-router-dom";
import { fetchCurrentWeather, fetchForecast } from "../store/weatherSlice";
import React, { useEffect, useState } from "react";
import { searchCities } from "../api/weatherApi";
import type { City } from "../types/weather";
import backIcon from "../assets/buttons/back.svg";
import removeButton from "../assets/buttons/remove_button.svg";
import favouriteIconAdd from "../assets/buttons/favourite_button.svg";
import savedCities from "../assets/icons/saved_icon.svg";
import { addFavourite, removeFavourite } from "../store/favouriteSlice";
import styles from "./CitySearchPage.module.scss";

export const CitySearchPage = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<City[]>([]);

  const favourites = useAppSelector((state) => state.favourites.cities);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleCityClick = (city: City) => {
    dispatch(fetchCurrentWeather({ lat: city.lat, lon: city.lon }));
    dispatch(fetchForecast({ lat: city.lat, lon: city.lon }));
    navigate("/");
  };

  const handleAddFavourite = (event: React.MouseEvent, city: City) => {
    event.stopPropagation();
    dispatch(addFavourite(city));
  };

  const handleRemoveFavourite = (event: React.MouseEvent, city: City) => {
    event.stopPropagation();
    dispatch(removeFavourite(city));
  };

  useEffect(() => {
    if (query === "") {
      setResults([]);
      return;
    }

    const timeoutId = setTimeout(() => {
      searchCities(query).then((cities) => {
        setResults(cities);
      });
    }, 400);

    return () => clearTimeout(timeoutId);
  }, [query]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => navigate("/")}>
          <img
            className={styles.backIcon}
            src={backIcon}
            alt="back navigation"
          />
        </button>
        <input
          className={styles.searchInput}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search city..."
        />
      </div>

      {query === "" ? (
        <div className={styles.list}>
          <p className={styles.sectionTitle}>
            <img
              className={styles.sectionIcon}
              src={savedCities}
              alt="saved cities"
            />
            Favourite cities
          </p>
          {favourites.map((city) => (
            <div
              className={styles.cityRow}
              key={`${city.lat}-${city.lon}`}
              onClick={() => handleCityClick(city)}
            >
              <span className={styles.cityName}>
                {city.name}, {city.country}
              </span>
              <button
                className={styles.actionButton}
                onClick={(e) => handleRemoveFavourite(e, city)}
              >
                <img
                  className={styles.actionIcon}
                  src={removeButton}
                  alt="remove button"
                />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.list}>
          {results.map((city) => {
            const isFavourite = favourites.some(
              (fav) => fav.lat === city.lat && fav.lon === city.lon,
            );

            return (
              <div
                className={styles.cityRow}
                key={`${city.lat}-${city.lon}`}
                onClick={() => handleCityClick(city)}
              >
                <span className={styles.cityName}>
                  {city.name}, {city.country}
                </span>
                {isFavourite ? (
                  <button
                    className={styles.actionButton}
                    onClick={(e) => handleRemoveFavourite(e, city)}
                  >
                    <img
                      className={styles.actionIcon}
                      src={savedCities}
                      alt="favourite button"
                    />
                  </button>
                ) : (
                  <button
                    className={styles.actionButton}
                    onClick={(e) => handleAddFavourite(e, city)}
                  >
                    <img
                      className={styles.actionIcon}
                      src={favouriteIconAdd}
                      alt="favourite button"
                    />
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
