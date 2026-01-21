import { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext({});

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');

        if (token && savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const signUp = async (email, password, fullName) => {
        try {
            const response = await authAPI.register({ email, password, fullName });
            const { token, user } = response.data.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);

            return { success: true, data: response.data };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Registration failed');
        }
    };

    const signIn = async (email, password) => {
        try {
            const response = await authAPI.login({ email, password });
            const { token, user } = response.data.data;

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            setUser(user);

            return { success: true, data: response.data };
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    };

    const signOut = async () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };

    const value = {
        user,
        loading,
        signUp,
        signIn,
        signOut,
        updateUser: (userData) => {
            localStorage.setItem('user', JSON.stringify(userData));
            setUser(userData);
        }
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
