import "./App.css";
import NavBar from "./components/NavBar";
import { Outlet } from "react-router-dom";
import { useState } from "react";

function App() {
  const [cart, setCart] = useState({});

  // Function to add/remove items to/from the cart
  const updateCart = (product, quantity) => {
    setCart((prevCart) => {
      const id = product.id;
      const existingQuantity = prevCart[product.id] || 0;
      const newQuantity = existingQuantity + quantity;
      if (newQuantity <= 0) {
        const newCart = { ...prevCart };
        delete newCart[id]; // Remove the product from the newCart
        return newCart;
      }
      return {
        ...prevCart,
        [id]: existingQuantity + quantity, // Update quantity or add new item
      };
    });
  };

  const totalItems = Object.values(cart).reduce((acc, qty) => acc + qty, 0);
  return (
    <div className="app-layout">
      <NavBar totalItems={totalItems} />
      <div className="main-content">
        <Outlet context={{ cart, updateCart }} />
      </div>
    </div>
  );
}

export default App;
