import { useEffect, useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import styles from './Shop.module.css';

export default function Shop() {

    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { cart, updateCart } = useOutletContext(); // Get cart and updateCart from App via Outlet
    const [quantities, setQuantities] = useState({}); // Store input quantities for each product

    // Fetch products object
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('https://fakestoreapi.com/products/'
                );
                if (!response.ok) {
                    throw new Error('Network response from Fakestore API failed');
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
        return <div>No data available</div>
    }


    // Get quantities of each item in cart
    const getCartQuantity = (productId) => {
        return cart[productId] || 0; // Get quantity from the cart object or 0 if not present
    };

    // Handle quantity change in input field
    const handleQuantityChange = (productId, value) => {
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [productId]: value,
        }));
    };

    const handleUpdateCart = (item) => {
        const quantityToAdd = quantities[item.id] || 1;
        updateCart(item, quantityToAdd);
        handleQuantityChange(item.id, 1); // Reset the quantity input back to 1 after adding
    };

    const renderCategory = (categoryName) => (
        <div className={styles.category}>
            <div className={styles.title}>{categoryName}</div>
            <div className={styles.cardContainer}>
                {products
                    .filter((item) => item.category === categoryName.toLowerCase())
                    .map((item) => (
                        <div className={styles.card} key={item.id}>
                            <div className={styles.addToCart}>
                                <div>Quantity in Cart: {getCartQuantity(item.id)}</div>
                                <input type="number" min="0" step="1" value={quantities[item.id] || 1}
                                    onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))} />
                                <button onClick={() => {
                                    handleUpdateCart(item)
                                }}>Add to Cart</button>
                            </div>
                            <img src={item.image} width="50px" alt={item.title} />
                            <div className={styles.name} title={item.title}>{item.title}</div>
                            <div>{item.price}€</div>
                        </div>
                    ))}
            </div>
        </div>
    );


    return (
        <div className={styles.shop}>
            {renderCategory('Electronics')}
            {renderCategory('Jewelery')}
            {renderCategory(`Men's clothing`)}
            {renderCategory(`Women's clothing`)}
        </div>
    );
}