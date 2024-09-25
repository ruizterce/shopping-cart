import "./App.css";
import NavBar from "./components/NavBar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

function App() {

  const [cart, setCart] = useState({});

  // Function to add items to the cart
  const addToCart = (product, quantity) => {
    setCart((prevCart) => {
      const existingQuantity = prevCart[product.id] || 0;
      return {
        ...prevCart,
        [product.id]: existingQuantity + quantity, // Update quantity or add new item
      };
    });
  };

  const totalItems = Object.values(cart).reduce((acc, qty) => acc + qty, 0);
  return (
    <div className="app-layout">
      <NavBar totalItems={totalItems} />
      <div className="main-content">
        <Outlet context={{cart, addToCart}} />
      </div>
    </div>
  );

}

export default App;
