import axios, { CanceledError } from "axios";

export { CanceledError }
const apiClient = axios.create({
    //baseURL: 'https://10.10.248.100',
    baseURL: 'http://127.0.0.1:3000',
});

export default apiClient;