// Strapi API Configuration
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:1337';

export const api = {
    // Auth endpoints
    login: async (identifier, password) => {
        const response = await fetch(`${API_URL}/api/auth/local`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identifier, password }),
        });
        if (!response.ok) throw new Error('Login failed');
        return response.json();
    },

    register: async (username, email, password) => {
        const response = await fetch(`${API_URL}/api/auth/local/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        });
        if (!response.ok) throw new Error('Registration failed');
        return response.json();
    },

    // Get current user
    getMe: async (token) => {
        const response = await fetch(`${API_URL}/api/users/me`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) throw new Error('Failed to fetch user');
        return response.json();
    },

    // Products endpoints
    getProducts: async () => {
        const response = await fetch(`${API_URL}/api/products?populate=*`);
        if (!response.ok) throw new Error('Failed to fetch products');
        return response.json();
    },

    uploadProduct: async (token, productData, imageFile) => {
        // Step 1: Create Product (JSON only)
        const createResponse = await fetch(`${API_URL}/api/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ data: productData }),
        });

        if (!createResponse.ok) {
            const errorData = await createResponse.json();
            console.error('Create product failed:', errorData);
            throw new Error('Failed to create product entry');
        }

        const product = await createResponse.json();

        // If there is no image, we are done
        if (!imageFile) return product;

        // Step 2: Upload Image linked to the product
        // Strapi v4/v5 structure: product.data.id or product.id depending on formatting
        const productId = product.data?.id || product.id;

        const formData = new FormData();
        formData.append('files', imageFile);
        formData.append('ref', 'api::product.product');
        formData.append('refId', productId);
        formData.append('field', 'image');

        const uploadResponse = await fetch(`${API_URL}/api/upload`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                // Do NOT set Content-Type header for FormData, browser does it automatically with boundary
            },
            body: formData,
        });

        if (!uploadResponse.ok) {
            const uploadError = await uploadResponse.json();
            console.error('Upload image failed:', uploadError);
            // Verify if we should throw or just warn. 
            // Throwing ensures user knows image failed, even if product created.
            throw new Error('Product created but image upload failed');
        }

        return product;
    },

    // Orders endpoints (for checkout)
    createOrder: async (token, orderData) => {
        const response = await fetch(`${API_URL}/api/orders`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ data: orderData }),
        });
        if (!response.ok) throw new Error('Failed to create order');
        return response.json();
    },
};

export default api;
