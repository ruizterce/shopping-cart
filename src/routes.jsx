import App from "./App";
import Home from "./components/Home";
import Shop from "./components/Shop";
import ErrorPage from "./components/ErrorPage";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <Home />
      },
      {
        path: "shop",
        element: <Shop />,
      },
    ]
  },

];

export default routes;
