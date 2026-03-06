import axios from "axios";

const isServer = typeof window === "undefined";
const baseURL = isServer ? "https://pharmlush.selamet.dev/api" : "";

const api = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 15000,
});

api.interceptors.request.use((config) => {
    if (isServer && process.env.PHARMLUSH_API_TOKEN) {
        config.headers.Authorization = `Bearer ${process.env.PHARMLUSH_API_TOKEN}`;
    }
    return config;
});

export default api;
