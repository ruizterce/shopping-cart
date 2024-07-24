import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <div>
      <h1>Oh no, nothing found here!</h1>
      <Link to="/">You can go back to the home page by clicking here</Link>
    </div>
  );
};

export default ErrorPage;
