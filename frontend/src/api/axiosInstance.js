import axios from 'axios';

const token = localStorage.getItem('token');
const apiKey = localStorage.getItem('apiKey');


const api = axios.create({
    baseURL: process.env.REACT_APP_BACKEND_URL,
    headers: {
        'x-api-key': apiKey, // لو بتستخدم API Key
        Authorization: `Bearer ${token}`
    }

});

export default api;
