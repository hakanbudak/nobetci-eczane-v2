import axios from "axios";

const PHARMLUSH_TOKEN = process.env.NEXT_PUBLIC_PHARMLUSH_TOKEN;

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_BASE || "https://pharmlush.selamet.dev",
    headers: {
        "Content-Type": "application/json",
        ...(PHARMLUSH_TOKEN ? { Authorization: `Bearer ${PHARMLUSH_TOKEN}` } : {}),
    },
    timeout: 15000,
});

export default api;
