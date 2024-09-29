import { Link } from "react-router-dom";
import styles from "./NavBar.module.css";

export default function NavBar({ totalItems }) {
  return (
    <nav className={styles.nav}>
      <Link to="/" className={styles.link}>
        Home
      </Link>
      <Link to="shop" className={styles.link}>
        Shop
      </Link>
      <Link to="cart" className={styles.link}>
        Cart
      </Link>
      <span>{totalItems}</span>
    </nav>
  );
}
