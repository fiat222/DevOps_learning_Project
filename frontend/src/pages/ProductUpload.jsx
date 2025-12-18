import { useState } from 'react';
import { api } from '../config/api'; // Corrected import (api is named export)
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ProductUpload() {
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        category: ''
    });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { token } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Ensure price is number
            const productData = {
                ...formData,
                price: Number(formData.price)
            };

            await api.uploadProduct(token, productData, image);
            navigate('/products');
        } catch (err) {
            console.error(err);
            setError('Failed to upload product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '2rem auto', padding: '2rem' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>Upload Product</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                    <label>Product Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label>Price</label>
                    <input
                        type="number"
                        step="0.01"
                        className="form-control"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label>Category</label>
                    <input
                        type="text"
                        className="form-control"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                </div>
                <div>
                    <label>Product Image</label>
                    <input
                        type="file"
                        className="form-control"
                        onChange={(e) => setImage(e.target.files[0])}
                        accept="image/*"
                    />
                </div>
                <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                    style={{ marginTop: '1rem' }}
                >
                    {loading ? 'Uploading...' : 'Upload Product'}
                </button>
            </form>
        </div>
    );
}
