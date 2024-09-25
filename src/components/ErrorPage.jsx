import { Link } from "react-router-dom";
import styles from './ErrorPage.module.css';

const ErrorPage = () => {
  return (
    <div className={styles.error}>
      <h1>Oh no, nothing found here!</h1>
      <Link to="/">You can go back to the home page by clicking here</Link>
    </div>
  );
};

export default ErrorPage;
