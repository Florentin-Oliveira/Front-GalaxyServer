import axios from 'axios';
import Cookies from 'js-cookie';
import autenticaStore from '../store/autentica.store';

const http = axios.create({
    baseURL: 'http://localhost:8000/api/',
    // baseURL: 'https://gerenciamento-backend-teste.vercel.app/api',
    withCredentials: true,
});

http.interceptors.request.use((config) => {
    if (!config.headers) {
        config.headers = {};
    }

    const token = autenticaStore.usuario.token;
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    const csrfToken = Cookies.get('csrftoken');
    if (csrfToken) {
        config.headers['X-CSRFToken'] = csrfToken;
    } else {
        console.error('CSRF token is missing');
    }

    return config;
});

http.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            autenticaStore.handle401();
        }
        return Promise.reject(error);
    }
);
export default http;
