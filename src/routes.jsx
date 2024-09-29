import App from "./App";
import Home from "./components/Home";
import Shop from "./components/Shop";
import CartPage from "./components/CartPage";
import ErrorPage from "./components/ErrorPage";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "shop",
        element: <Shop />,
      },
      { path: "cart", element: <CartPage /> },
    ],
  },
];

export default routes;
