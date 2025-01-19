import axios from 'axios';
const BASE_URL = process.env.REACT_APP_AUTH_URL;
const API_URL = process.env.REACT_APP_API_URL
const SERVER_URL = process.env.REACT_APP_SERVER_URL;

export default axios.create({
    baseURL: BASE_URL
});

export const axiosPrivate = axios.create({
    baseURL: SERVER_URL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});
