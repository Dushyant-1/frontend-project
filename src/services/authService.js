import api from './api';

const authService = {
    async login(email, password) {
        const response = await api.post('/auth/login', { email, password });
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    },

    async register(userData) {
        const response = await api.post('/auth/register', userData);
        return response.data;
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    getCurrentUser() {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    isAuthenticated() {
        return !!localStorage.getItem('token');
    },

    getUserRole() {
        const user = this.getCurrentUser();
        return user ? user.role : null;
    }
};

export default authService; 