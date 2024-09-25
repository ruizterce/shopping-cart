import { useEffect, useState } from 'react';
import styles from './Shop.module.css';

export default function Shop() {

    const [products, setProducts] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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

    console.log(products)

    return <div className={styles.shop}>
        <div className={styles.category}>
            <div className={styles.title}>Electronics</div>
            <div className={styles.cardContainer}>
                {products.map((item) => (
                    item.category === 'electronics' &&
                    <div className={styles.card} key={item.id}>
                        <img src={item.image} width="50px"></img>
                        <div className={styles.name} title={item.title}>{item.title}</div>
                        <div>{item.price}€</div>
                    </div>
                ))}
            </div>
        </div>
        <div className={styles.category}>
            <div className={styles.title}>Jewelery</div>
            <div className={styles.cardContainer}>
                {products.map((item) => (
                    item.category === 'jewelery' &&
                    <div className={styles.card} key={item.id}>
                        <img src={item.image}></img>
                        <div className={styles.name} title={item.title}>{item.title}</div>
                        <div>{item.price}€</div>
                    </div>
                ))}
            </div>
        </div>

    </div>;
}