import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Link } from "react-router-dom";
import styles from "./CartPage.module.css";

export default function CartPage() {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { cart, updateCart } = useOutletContext();

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("https://fakestoreapi.com/products/");
        if (!response.ok) {
          throw new Error("Network response from Fakestore API failed");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        setError(error);
      }
      setLoading(false);
    };
    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading Products...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!products) {
    return <div>No data available</div>;
  }

  if (Object.keys(cart).length === 0) {
    return (
      <div>
        <div>Your cart is empty</div>
        <div>
          Go to <Link to="/Shop">our Shop</Link> to add some products
        </div>
      </div>
    );
  }

  const cartProductIds = Object.keys(cart).map((id) => parseInt(id));
  const cartProducts = products
    .filter((product) => cartProductIds.includes(product.id))
    .map((product) => ({ ...product, quantity: cart[product.id] }));

  const totalPrice = cartProducts.reduce((acc, product) => {
    return acc + product.price * product.quantity;
  }, 0);

  return (
    <div className={styles.cartPage}>
      <div className={styles.title}>Your Cart</div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Product</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {cartProducts.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.title}</td>
              <td>{product.price} €</td>
              <td>
                <button
                  className={styles.removeButton}
                  onClick={() => {
                    updateCart(product, -product.quantity);
                  }}
                >
                  X
                </button>
                <button
                  className={styles.quantityButton}
                  onClick={() => {
                    updateCart(product, -1);
                  }}
                >
                  -
                </button>
                {" " + product.quantity + " "}
                <button
                  className={styles.quantityButton}
                  onClick={() => {
                    updateCart(product, 1);
                  }}
                >
                  +
                </button>
              </td>
              <td>{product.price * product.quantity} €</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td>{totalPrice} €</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
