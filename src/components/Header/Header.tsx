import { useAppSelector } from "../../store/hooks";
import searchButton from "../../assets/buttons/search_button.svg";
import styles from "./Header.module.scss";
import location from "../../assets/pins/location.svg";

export const Header = () => {
  const cityName = useAppSelector((state) => state.weather.data?.currentCity);

  return (
    <div className={styles.container}>
      <span className={styles.cityContainer}>
        <img className={styles.location} src={location} alt="location" />
        <span className={styles.cityName}>{cityName}</span>
      </span>
      <button className={styles.button}>
        <img src={searchButton} alt="search button" />
      </button>
    </div>
  );
};
