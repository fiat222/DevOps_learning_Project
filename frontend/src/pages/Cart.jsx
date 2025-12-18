import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Minus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../config/api';

export default function Cart() {
    const { cart, removeFromCart, updateQuantity, total, clearCart } = useCart();
    const { token } = useAuth();
    const navigate = useNavigate();
    const [isProcessing, setIsProcessing] = useState(false);

    const handleCheckout = async () => {
        if (!token) {
            alert('Please login to checkout');
            return;
        }

        setIsProcessing(true);
        try {
            // Prepare order data for Strapi
            const orderData = {
                items: cart.map(item => ({
                    product: item.id,
                    quantity: item.quantity,
                    price: item.price,
                })),
                total: total,
                orderStatus: 'pending',
            };

            await api.createOrder(token, orderData);

            alert('Order placed successfully!');
            clearCart();
            navigate('/products');
        } catch (error) {
            console.error('Checkout failed:', error);
            alert('Failed to place order. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className="container animate-fade-in" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
                <h2 style={{ marginBottom: '1rem' }}>Your Cart is Empty</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Looks like you haven't added anything yet.</p>
                <Link to="/products" className="btn btn-primary">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="container animate-fade-in" style={{ padding: '2rem' }}>
            <Link to="/products" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                <ArrowLeft size={18} /> Continue Shopping
            </Link>

            <h1 className="page-title">Shopping Cart</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {cart.map(item => (
                        <div key={item.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <img
                                src={item.image}
                                alt={item.name}
                                style={{ width: '80px', height: '80px', borderRadius: '8px', objectFit: 'cover' }}
                            />

                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{item.name}</h3>
                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>${item.price} each</div>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '0.25rem', borderRadius: '8px' }}>
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                    style={{ padding: '0.25rem', color: 'var(--text-primary)', background: 'transparent' }}
                                >
                                    <Minus size={16} />
                                </button>
                                <span style={{ minWidth: '20px', textAlign: 'center', fontWeight: 'bold' }}>{item.quantity}</span>
                                <button
                                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    style={{ padding: '0.25rem', color: 'var(--text-primary)', background: 'transparent' }}
                                >
                                    <Plus size={16} />
                                </button>
                            </div>

                            <div style={{ fontWeight: 'bold', minWidth: '80px', textAlign: 'right' }}>
                                ${(item.price * item.quantity).toFixed(2)}
                            </div>

                            <button
                                onClick={() => removeFromCart(item.id)}
                                className="btn-danger"
                                style={{ padding: '0.5rem', borderRadius: '6px' }}
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>

                <div className="card" style={{ position: 'sticky', top: '100px' }}>
                    <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>Order Summary</h3>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                        <span>${total.toFixed(2)}</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
                        <span>Free</span>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', fontWeight: 'bold', fontSize: '1.25rem' }}>
                        <span>Total</span>
                        <span style={{ color: 'var(--accent-color)' }}>${total.toFixed(2)}</span>
                    </div>

                    <button
                        onClick={handleCheckout}
                        className="btn btn-primary"
                        style={{ width: '100%', marginTop: '2rem', justifyContent: 'center' }}
                        disabled={isProcessing}
                    >
                        {isProcessing ? 'Processing...' : 'Checkout'}
                    </button>
                </div>
            </div>
        </div>
    );
}
