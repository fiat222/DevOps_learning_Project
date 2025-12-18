import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { Plus } from 'lucide-react';
import api from '../config/api';

export default function ProductList() {
    const { addToCart } = useCart();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.getProducts();

                console.log('Strapi response:', response); // Debug log

                // Check if response has data
                if (!response || !response.data) {
                    throw new Error('Invalid response format');
                }

                // Transform Strapi response to match our format
                const transformedProducts = response.data.map(item => {
                    // Strapi v5 returns data directly without attributes wrapper
                    const data = item.attributes || item;

                    // Handle image URL - Strapi v5 format
                    let imageUrl = 'https://via.placeholder.com/500';

                    if (data.image) {
                        // v5 format: image is direct object with url
                        if (data.image.url) {
                            imageUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:1337'}${data.image.url}`;
                        }
                        // v4 format: image.data.attributes.url (fallback)
                        else if (data.image.data?.attributes?.url) {
                            imageUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:1337'}${data.image.data.attributes.url}`;
                        }
                    }

                    return {
                        id: item.id,
                        name: data.name || 'Unnamed Product',
                        price: data.price || 0,
                        category: data.category || 'Uncategorized',
                        image: imageUrl,
                    };
                });

                console.log('Transformed products:', transformedProducts); // Debug log
                setProducts(transformedProducts);
            } catch (err) {
                console.error('Failed to fetch products:', err);
                setError('Failed to load products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <div className="container animate-fade-in" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                <h2>Loading products...</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container animate-fade-in" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                <h2 style={{ color: 'var(--danger)' }}>{error}</h2>
                <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
                    Please make sure your Strapi backend is running.
                </p>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="container animate-fade-in" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                <h2>No products available</h2>
                <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>
                    Add some products in your Strapi admin panel.
                </p>
            </div>
        );
    }

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem' }}>
            <h1 className="page-title">Featured Products</h1>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '2rem'
            }}>
                {products.map(product => (
                    <div key={product.id} className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>
                        <div style={{ height: '200px', overflow: 'hidden', position: 'relative' }}>
                            <img
                                src={product.image}
                                alt={product.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                            <div style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'rgba(0,0,0,0.6)',
                                padding: '0.25rem 0.75rem',
                                borderRadius: '20px',
                                fontSize: '0.8rem',
                                backdropFilter: 'blur(4px)'
                            }}>
                                {product.category}
                            </div>
                        </div>

                        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{product.name}</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '1rem' }}>
                                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>
                                    ${product.price}
                                </span>
                                <button
                                    onClick={() => addToCart(product)}
                                    className="btn btn-primary"
                                    style={{ padding: '0.5rem 1rem' }}
                                >
                                    <Plus size={18} /> Add
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
