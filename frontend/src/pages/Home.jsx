import { useState, useEffect } from 'react';
import { api } from '../config/api';
import { useCart } from '../context/CartContext';
import { ShoppingCart } from 'lucide-react';

// Using inline styles for simplicity as per existing pattern
const cardStyle = {
    border: '1px solid #ddd',
    borderRadius: '8px',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    background: 'var(--card-bg, #fff)'
};

const imageStyle = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '4px'
};

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await api.getProducts();
                setProducts(data.data);
            } catch (err) {
                setError('Failed to load products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading products...</div>;
    if (error) return <div style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</div>;

    return (
        <div className="container" style={{ padding: '2rem' }}>
            <h1 style={{ marginBottom: '2rem' }}>All Products</h1>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '2rem'
            }}>
                {products.map((product) => {
                    const { name, price, image } = product; // Strapi v5 structure might differ, checking v4 structure: product.attributes?
                    // Adapting to standard Strapi v4 response structure where attributes holds the data
                    // If v5 or flat structure, this might need adjustment. Assuming v4 as per typical setup or flattened.
                    // Let's assume flattened for safety based on previous files, or check if attributes exists.

                    const displayProduct = product.attributes || product;
                    let imageUrl = 'https://via.placeholder.com/200';

                    if (displayProduct.image) {
                        // v5 format: image is direct object with url
                        if (displayProduct.image.url) {
                            imageUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:1337'}${displayProduct.image.url}`;
                        }
                        // v4 format: image.data.attributes.url (fallback)
                        else if (displayProduct.image.data?.attributes?.url) {
                            imageUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:1337'}${displayProduct.image.data.attributes.url}`;
                        }
                    }

                    return (
                        <div key={product.id} style={cardStyle}>
                            <img
                                src={imageUrl}
                                alt={displayProduct.name}
                                style={imageStyle}
                            />
                            <h3>{displayProduct.name}</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>{displayProduct.category}</p>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginTop: 'auto'
                            }}>
                                <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                                    ${Number(displayProduct.price).toFixed(2)}
                                </span>
                                <button
                                    className="btn btn-primary"
                                    onClick={() => addToCart(product)}
                                    title="Add to Cart"
                                >
                                    <ShoppingCart size={20} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {products.length === 0 && (
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No products found.
                </p>
            )}
        </div>
    );
}
