import { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing session
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('user_data');

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (identifier, password) => {
        try {
            const response = await api.login(identifier, password);

            // Strapi returns: { jwt, user }
            const { jwt, user: userData } = response;

            setToken(jwt);
            setUser(userData);
            localStorage.setItem('auth_token', jwt);
            localStorage.setItem('user_data', JSON.stringify(userData));

            return userData;
        } catch (error) {
            throw new Error('Invalid credentials');
        }
    };

    const register = async (username, email, password) => {
        try {
            const response = await api.register(username, email, password);
            const { jwt, user: userData } = response;

            setToken(jwt);
            setUser(userData);
            localStorage.setItem('auth_token', jwt);
            localStorage.setItem('user_data', JSON.stringify(userData));

            return userData;
        } catch (error) {
            throw new Error('Registration failed');
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_data');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
