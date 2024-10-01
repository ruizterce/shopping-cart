import styles from "./Home.module.css";
import landingImage from "../assets/images/landing_main.jpeg";

export default function Home() {
  return (
    <div className={styles.home}>
      <img src={landingImage} alt="Landing page image" />
    </div>
  );
}
