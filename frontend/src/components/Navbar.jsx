import { Link, useLocation } from 'react-router-dom';
import { ShoppingCart, LogOut, User, Package } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const { itemCount } = useCart();
    const location = useLocation();

    const isActive = (path) => location.pathname === path ? 'active' : '';

    return (
        <nav className="navbar">
            <div className="container nav-content">
                <Link to="/" className="nav-links" style={{ gap: '0.5rem', fontSize: '1.25rem', fontWeight: 'bold' }}>
                    <Package color="var(--accent-color)" />
                    <span style={{ color: 'white' }}>DevStore</span>
                </Link>

                <div className="nav-links">
                    {user ? (
                        <>
                            <Link to="/products" className={`nav-link ${isActive('/products')}`}>Products</Link>
                            <Link to="/upload-product" className={`nav-link ${isActive('/upload-product')}`}>Upload Product</Link>
                            <Link to="/cart" className={`nav-link ${isActive('/cart')}`} style={{ position: 'relative' }}>
                                <ShoppingCart size={20} />
                                {itemCount > 0 && (
                                    <span style={{
                                        position: 'absolute',
                                        top: '-8px',
                                        right: '-8px',
                                        background: 'var(--accent-color)',
                                        color: 'white',
                                        fontSize: '0.7rem',
                                        width: '18px',
                                        height: '18px',
                                        borderRadius: '50%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        {itemCount}
                                    </span>
                                )}
                            </Link>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '1rem' }}>
                                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                    Hi, {user.username}
                                </span>
                                <button onClick={logout} className="btn-outline" style={{ padding: '0.4rem', border: 'none' }} title="Logout">
                                    <LogOut size={20} />
                                </button>
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <Link to="/login" className="btn btn-primary">
                                Login
                            </Link>
                            <Link to="/signup" className="btn btn-outline">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}
