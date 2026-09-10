import linkedInIcon from "../../assets/footer-icons/linkedin.svg";
import gitHubIcon from "../../assets/footer-icons/github.svg";
import styles from "./Footer.module.scss";

export const Footer = () => {
  return (
    <div className={styles.container}>
      <p className={styles.author}>Made by Ihor Shtoiko ©</p>
      <div className={styles.linksContainer}>
        <a href="https://www.linkedin.com/in/ihorshtoikodev/">
          <img className={styles.linkIcon} src={linkedInIcon} alt="LinkedIn link" />
        </a>
        <a href="https://github.com/shtoikoihor">
          <img className={styles.linkIcon} src={gitHubIcon} alt="Github link" />
        </a>
      </div>
    </div>
  );
};
