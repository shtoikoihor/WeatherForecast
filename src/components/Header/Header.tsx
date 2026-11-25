import { useAppSelector } from "../../store/hooks";
import { useNavigate } from "react-router-dom";
import searchButton from "../../assets/buttons/search_button.svg";
import styles from "./Header.module.scss";
import location from "../../assets/pins/location.svg";
import { ThemeToggle } from "../ThemeToggle/ThemeToggle";
import { UnitsMenu } from "../UnitsMenu/UnitsMenu";

export const Header = () => {
  const navigate = useNavigate();
  const cityName = useAppSelector((state) => state.weather.data?.currentCity);

  return (
    <div className={styles.container}>
      <span className={styles.cityContainer}>
        <img className={styles.location} src={location} alt="location" />
        <span className={styles.cityName}>{cityName}</span>
      </span>
      <div className={styles.actions}>
        <button
          className={styles.button}
          aria-label="Search city"
          onClick={() => navigate("/search")}
        >
          <img
            className={styles.buttonIcon}
            src={searchButton}
            alt=""
          />
        </button>
        <UnitsMenu />
        <ThemeToggle />
      </div>
    </div>
  );
};
