import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth APIs
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getCurrentUser: () => api.get('/auth/me'),
    updateProfile: (data) => api.put('/auth/me', data),
    changePassword: (data) => api.put('/auth/password', data),
};

// Transaction APIs
export const transactionAPI = {
    getAll: (params) => api.get('/transactions', { params }),
    getById: (id) => api.get(`/transactions/${id}`),
    create: (data) => api.post('/transactions', data),
    update: (id, data) => api.put(`/transactions/${id}`, data),
    delete: (id) => api.delete(`/transactions/${id}`),
    getStats: (params) => api.get('/transactions/stats', { params }),
    getTrend: (params) => api.get('/transactions/trend', { params }),
    getRecent: (params) => api.get('/transactions/recent', { params }),
};


// Category APIs
export const categoryAPI = {
    getAll: () => api.get('/categories'),
    getByType: (type) => api.get(`/categories/type/${type}`),
    create: (data) => api.post('/categories', data),
    update: (id, data) => api.put(`/categories/${id}`, data),
    delete: (id) => api.delete(`/categories/${id}`),
};

// Budget APIs
export const budgetAPI = {
    getAll: (params) => api.get('/budgets', { params }),
    create: (data) => api.post('/budgets', data),
    delete: (id) => api.delete(`/budgets/${id}`),
};

// Report APIs
export const reportAPI = {
    getMonthly: (params) => api.get('/reports/monthly', { params }),
    getYearly: (params) => api.get('/reports/yearly', { params }),
};

// Chat APIs
export const chatAPI = {
    send: (data) => api.post('/chat', data),
    getHistory: (params) => api.get('/chat/history', { params }),
    clearHistory: () => api.delete('/chat/history'),
};

// Admin APIs
export const adminAPI = {
    // User management
    getAllUsers: () => api.get('/admin/users'),
    getUserById: (id) => api.get(`/admin/users/${id}`),
    create: (data) => api.post('/admin/users', data),
    update: (id, data) => api.put(`/admin/users/${id}`, data),
    updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, null, { params: { role } }),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),

    // System Settings
    getSettings: () => api.get('/admin/settings'),
    updateSettings: (data) => api.post('/admin/settings', data),
};

export default api;
