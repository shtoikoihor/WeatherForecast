import { useAppSelector } from "../../store/hooks";
import { useNavigate } from "react-router-dom";
import searchButton from "../../assets/buttons/search_button.svg";
import styles from "./Header.module.scss";
import location from "../../assets/pins/location.svg";

export const Header = () => {
  const navigate = useNavigate();
  const cityName = useAppSelector((state) => state.weather.data?.currentCity);

  return (
    <div className={styles.container}>
      <span className={styles.cityContainer}>
        <img className={styles.location} src={location} alt="location" />
        <span className={styles.cityName}>{cityName}</span>
      </span>
      <button className={styles.button} onClick={() => navigate("/search")}>
        <img
          className={styles.buttonIcon}
          src={searchButton}
          alt="search button"
        />
      </button>
    </div>
  );
};
